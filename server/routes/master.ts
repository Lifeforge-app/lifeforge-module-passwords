import { decrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import z from 'zod'

let challenge = v4()
setInterval(() => {
  challenge = v4()
}, 1000 * 60)

const getChallenge = forgeController
  .query()
  .description({
    en: 'Retrieve challenge token for master password authentication',
    ms: 'Dapatkan token cabaran untuk pengesahan kata laluan induk',
    'zh-CN': '获取主密码身份验证的挑战令牌',
    'zh-TW': '獲取主密碼身份驗證的挑戰令牌'
  })
  .input({})
  .callback(async () => challenge)

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new master password',
    ms: 'Cipta kata laluan induk baharu',
    'zh-CN': '创建新的主密码',
    'zh-TW': '創建新的主密碼'
  })
  .input({
    body: z.object({
      password: z.string()
    })
  })
  .callback(async ({ pb, body: { password } }) => {
    const salt = await bcrypt.genSalt(10)

    const decryptedMaster = decrypt2(password, challenge)

    const masterPasswordHash = await bcrypt.hash(decryptedMaster, salt)

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
  .description({
    en: 'Verify master password against stored hash',
    ms: 'Sahkan kata laluan induk terhadap hash yang disimpan',
    'zh-CN': '验证主密码与存储的哈希值',
    'zh-TW': '驗證主密碼與存儲的哈希值'
  })
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
  .description({
    en: 'Validate OTP for master password operations',
    ms: 'Sahkan OTP untuk operasi kata laluan induk',
    'zh-CN': '验证主密码操作的一次性密码',
    'zh-TW': '驗證主密碼操作的一次性密碼'
  })
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
