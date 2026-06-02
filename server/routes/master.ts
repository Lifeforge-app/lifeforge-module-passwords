import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import z from 'zod'

import forge from '../forge'

let challenge = v4()

setInterval(() => {
  challenge = v4()
}, 1000 * 60)

export const getChallenge = forge
  .query({
    description: 'Retrieve challenge token for master password authentication',
    output: {
      OK: z.string()
    }
  })
  .callback(async ({ response }) => response.ok(challenge))

export const create = forge
  .mutation({
    description: 'Create a new master password',
    input: {
      body: z.object({
        password: z.string()
      })
    },
    output: {
      NO_CONTENT: true
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
      const salt = await bcrypt.genSalt(10)

      const decryptedMaster = decrypt2(password, challenge)

      const masterPasswordHash = await bcrypt.hash(decryptedMaster, salt)

      await pb.instance
        .collection('users')
        .update(pb.instance.authStore.record!.id, {
          masterPasswordHash
        })

      return response.noContent()
    }
  )

export const verify = forge
  .mutation({
    description: 'Verify master password against stored hash',
    input: {
      body: z.object({
        password: z.string()
      })
    },
    output: {
      OK: z.boolean()
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

      const user = await pb.instance
        .collection('users')
        .getOne(pb.instance.authStore.record!.id)

      const { masterPasswordHash } = user

      return response.ok(
        await bcrypt.compare(decryptedMaster, masterPasswordHash)
      )
    }
  )

export const validateOTP = forge
  .mutation({
    description: 'Validate OTP for master password operations',
    input: {
      body: z.object({
        otp: z.string(),
        otpId: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(
    async ({
      pb,
      body,
      core: {
        validation: { validateOTP }
      },
      response
    }) => response.ok(await validateOTP(pb, body, challenge))
  )
