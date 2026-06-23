import crypto from 'node:crypto'
import z from 'zod'

import type { IPBService } from '@lifeforge/server-utils'

import forge from '../forge'
import schema from '../schema'
import { hash, verify as verifyPasswordHash } from '../utils/passwordHash'
import { masterChallenge as challenge } from './master'

async function getConfigRecord(pb: IPBService<typeof schema>) {
  const records = await pb.getFullList.collection('config').execute()

  return records[0] || null
}

export const generate = forge
  .mutation({
    description: 'Generate a recovery key that can unlock the VEK',
    input: {
      body: z.object({
        password: z.string()
      })
    },
    output: {
      OK: z.object({
        recovery_key: z.string()
      }),
      UNAUTHORIZED: true
    }
  })
  .callback(
    async ({
      pb,
      body: { password },
      core: {
        crypto: { decrypt2 }
      },
      response
    }) => {
      const decryptedMaster = decrypt2(password, challenge)

      const config = await getConfigRecord(pb)

      if (!config || !config.master_hash) {
        return response.unauthorized()
      }

      const isMatch = await verifyPasswordHash(
        decryptedMaster,
        config.master_hash
      )

      if (!isMatch) {
        return response.unauthorized()
      }

      const derivedKey = crypto
        .createHash('sha256')
        .update(decryptedMaster)
        .digest('base64')
        .slice(0, 32)

      const wrappedVEKData = Buffer.from(config.wrapped_vek, 'base64')
      const wrappedIV = wrappedVEKData.subarray(0, 12)
      const wrappedCiphertext = wrappedVEKData.subarray(12)
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(derivedKey, 'utf-8'),
        wrappedIV
      )

      decipher.setAuthTag(wrappedCiphertext.subarray(-16))
      const vek = Buffer.concat([
        decipher.update(wrappedCiphertext.subarray(0, -16)),
        decipher.final()
      ])

      const recoveryKey = crypto.randomBytes(32)
      const recoveryKeyHex = recoveryKey.toString('hex')

      const recoveryDerivedKey = crypto
        .createHash('sha256')
        .update(recoveryKey)
        .digest('base64')
        .slice(0, 32)

      const recoveryIV = crypto.randomBytes(12)
      const recoveryCipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(recoveryDerivedKey, 'utf-8'),
        recoveryIV
      )

      const recoveryEncrypted = Buffer.concat([
        recoveryCipher.update(vek),
        recoveryCipher.final()
      ])

      const recoveryTag = recoveryCipher.getAuthTag()
      const recoveryWrappedVEK = Buffer.concat([
        recoveryIV,
        recoveryEncrypted,
        recoveryTag
      ]).toString('base64')

      await pb.update
        .collection('config')
        .id(config.id)
        .data({ recovery_wrapped_vek: recoveryWrappedVEK })
        .execute()

      return response.ok({ recovery_key: recoveryKeyHex })
    }
  )

export const status = forge
  .query({
    description: 'Check if a recovery key has been configured',
    output: {
      OK: z.object({
        has_recovery_key: z.boolean()
      })
    }
  })
  .callback(async ({ pb, response }) => {
    const config = await getConfigRecord(pb)

    return response.ok({
      has_recovery_key: !!config?.recovery_wrapped_vek
    })
  })

export const recover = forge
  .mutation({
    description:
      'Recover account using recovery key and set a new master password',
    input: {
      body: z.object({
        recovery_key: z.string(),
        new_password: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      body: { recovery_key, new_password },
      core: {
        crypto: { decrypt2 }
      },
      response
    }) => {
      const decryptedRecoveryKey = decrypt2(recovery_key, challenge)
      const decryptedNewPassword = decrypt2(new_password, challenge)

      const config = await getConfigRecord(pb)

      if (!config || !config.recovery_wrapped_vek) {
        return response.badRequest('No recovery key configured')
      }

      const recoveryKeyBuffer = Buffer.from(decryptedRecoveryKey, 'hex')

      const recoveryDerivedKey = crypto
        .createHash('sha256')
        .update(recoveryKeyBuffer)
        .digest('base64')
        .slice(0, 32)

      const recoveryData = Buffer.from(config.recovery_wrapped_vek, 'base64')
      const recoveryIV = recoveryData.subarray(0, 12)
      const recoveryCiphertext = recoveryData.subarray(12)
      const recoveryDecipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(recoveryDerivedKey, 'utf-8'),
        recoveryIV
      )

      recoveryDecipher.setAuthTag(recoveryCiphertext.subarray(-16))
      const vek = Buffer.concat([
        recoveryDecipher.update(recoveryCiphertext.subarray(0, -16)),
        recoveryDecipher.final()
      ])

      const newMasterHash = await hash(decryptedNewPassword)

      const newDerivedKey = crypto
        .createHash('sha256')
        .update(decryptedNewPassword)
        .digest('base64')
        .slice(0, 32)

      const newIV = crypto.randomBytes(12)
      const newCipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(newDerivedKey, 'utf-8'),
        newIV
      )

      const newEncrypted = Buffer.concat([
        newCipher.update(vek),
        newCipher.final()
      ])

      const newTag = newCipher.getAuthTag()
      const newWrappedVEK = Buffer.concat([
        newIV,
        newEncrypted,
        newTag
      ]).toString('base64')

      await pb.update
        .collection('config')
        .id(config.id)
        .data({
          master_hash: newMasterHash,
          wrapped_vek: newWrappedVEK
        })
        .execute()

      return response.noContent()
    }
  )
