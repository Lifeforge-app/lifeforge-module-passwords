import { decrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import z from 'zod'

let challenge = v4()
setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

const getChallenge = forgeController
  .query()
  .description('Get current challenge for master password operations')
  .input({})
  .callback(async () => challenge)

const create = forgeController
  .mutation()
  .description('Create a new master password')
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(async ({ pb, body: { password } }) => {
    const salt = await bcrypt.genSalt(10)

    const masterPasswordHash = await bcrypt.hash(password, salt)

    await pb.update
      .collection('user__users')
      .id(pb.instance.authStore.record!.id)
      .data({
        masterPasswordHash
      })
      .execute()
  })

const verify = forgeController
  .mutation()
  .description('Verify master password')
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(async ({ pb, body: { password } }) => {
    const decryptedMaster = decrypt2(password, challenge)

    const user = await pb.getOne
      .collection('user__users')
      .id(pb.instance.authStore.record!.id)
      .execute()

    const { masterPasswordHash } = user

    return await bcrypt.compare(decryptedMaster, masterPasswordHash)
  })

const validateOTP = forgeController
  .mutation()
  .description('Validate OTP for master password operations')
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(async ({ pb, body }) => await _validateOTP(pb, body, challenge))

export default forgeRouter({
  getChallenge,
  create,
  verify,
  validateOTP
})
