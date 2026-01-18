import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import z from 'zod'

import forge from '../forge'

let challenge = v4()

setInterval(() => {
  challenge = v4()
}, 1000 * 60)

export const getChallenge = forge
  .query()
  .description('Retrieve challenge token for master password authentication')
  .input({})
  .callback(async () => challenge)

export const create = forge
  .mutation()
  .description('Create a new master password')
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(
    async ({
      pb,
      body: { password },
      core: {
        crypto: { decrypt2 }
      }
    }) => {
      const salt = await bcrypt.genSalt(10)

      const decryptedMaster = decrypt2(password, challenge)

      const masterPasswordHash = await bcrypt.hash(decryptedMaster, salt)

      await pb.instance
        .collection('users')
        .update(pb.instance.authStore.record!.id, {
          masterPasswordHash
        })
    }
  )

export const verify = forge
  .mutation()
  .description('Verify master password against stored hash')
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(
    async ({
      pb,
      body: { password },
      core: {
        crypto: { decrypt2 }
      }
    }) => {
      const decryptedMaster = decrypt2(password, challenge)

      const user = await pb.instance
        .collection('users')
        .getOne(pb.instance.authStore.record!.id)

      const { masterPasswordHash } = user

      return await bcrypt.compare(decryptedMaster, masterPasswordHash)
    }
  )

export const validateOTP = forge
  .mutation()
  .description('Validate OTP for master password operations')
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(
    async ({
      pb,
      body,
      core: {
        validation: { validateOTP }
      }
    }) => await validateOTP(pb, body, challenge)
  )
