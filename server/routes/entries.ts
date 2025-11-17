import {
  decrypt as _decrypt,
  decrypt2,
  encrypt,
  encrypt2
} from '@functions/auth/encryption'
import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { v4 } from 'uuid'
import z from 'zod'

import { getDecryptedMaster } from '../utils/getDecryptedMaster'

export let challenge = v4()

setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

const getChallenge = forgeController
  .query()
  .description({
    en: 'Retrieve challenge token for password encryption',
    ms: 'Dapatkan token cabaran untuk penyulitan kata laluan',
    'zh-CN': '获取密码加密的挑战令牌',
    'zh-TW': '獲取密碼加密的挑戰令牌'
  })
  .input({})
  .callback(async () => challenge)

const list = forgeController
  .query()
  .description({
    en: 'Get all password entries with sorting',
    ms: 'Dapatkan semua entri kata laluan dengan penyusunan',
    'zh-CN': '获取所有密码条目并排序',
    'zh-TW': '獲取所有密碼條目並排序'
  })
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('passwords__entries')
      .sort(['-pinned', 'name'])
      .fields({
        id: true,
        name: true,
        icon: true,
        color: true,
        website: true,
        username: true,
        pinned: true,
        updated: true
      })
      .execute()
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new encrypted password entry',
    ms: 'Cipta entri kata laluan tersulitkan baharu',
    'zh-CN': '创建新的加密密码条目',
    'zh-TW': '創建新的加密密碼條目'
  })
  .input({
    body: SCHEMAS.passwords.entries.schema
      .omit({
        pinned: true,
        created: true,
        updated: true
      })
      .extend({
        master: z.string()
      })
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    const { master, password, ...rest } = body

    const decryptedMaster = await getDecryptedMaster(pb, master, challenge)

    const decryptedPassword = decrypt2(password, challenge)

    const encryptedPassword = encrypt(
      Buffer.from(decryptedPassword),
      decryptedMaster
    )

    await pb.create
      .collection('passwords__entries')
      .data({
        ...rest,
        password: encryptedPassword.toString('base64')
      })
      .execute()
  })

const update = forgeController
  .mutation()
  .description({
    en: 'Update an existing password entry',
    ms: 'Kemas kini entri kata laluan sedia ada',
    'zh-CN': '更新现有的密码条目',
    'zh-TW': '更新現有的密碼條目'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.passwords.entries.schema
      .omit({
        pinned: true,
        created: true,
        updated: true
      })
      .extend({
        master: z.string()
      })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .callback(async ({ pb, query: { id }, body }) => {
    const { master, password, ...rest } = body

    const decryptedMaster = await getDecryptedMaster(pb, master, challenge)

    const decryptedPassword = decrypt2(password, challenge)

    const encryptedPassword = encrypt(
      Buffer.from(decryptedPassword),
      decryptedMaster
    )

    await pb.update
      .collection('passwords__entries')
      .id(id)
      .data({
        ...rest,
        password: encryptedPassword.toString('base64')
      })
      .execute()
  })

const decrypt = forgeController
  .mutation()
  .description({
    en: 'Decrypt and retrieve a password entry.',
    ms: 'Nyahsulitkan dan dapatkan entri kata laluan',
    'zh-CN': '解密并检索密码条目',
    'zh-TW': '解密並檢索密碼條目'
  })
  .input({
    query: z.object({
      id: z.string(),
      master: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .callback(async ({ pb, query: { id, master } }) => {
    const decryptedMaster = await getDecryptedMaster(pb, master, challenge)

    const password = await pb.getOne
      .collection('passwords__entries')
      .id(id)
      .execute()

    const decryptedPassword = _decrypt(
      Buffer.from(password.password, 'base64'),
      decryptedMaster
    )

    return encrypt2(decryptedPassword.toString(), challenge)
  })

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete a password entry',
    ms: 'Padam entri kata laluan',
    'zh-CN': '删除密码条目',
    'zh-TW': '刪除密碼條目'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('passwords__entries').id(id).execute()
  )

const togglePin = forgeController
  .mutation()
  .description({
    en: 'Toggle pin status of a password entry',
    ms: 'Togol status pin entri kata laluan',
    'zh-CN': '切换密码条目的固定状态',
    'zh-TW': '切換密碼條目的固定狀態'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'passwords__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne
      .collection('passwords__entries')
      .id(id)
      .execute()

    await pb.update
      .collection('passwords__entries')
      .id(id)
      .data({
        pinned: !entry.pinned
      })
      .execute()
  })

export default forgeRouter({
  getChallenge,
  list,
  create,
  update,
  decrypt,
  remove,
  togglePin
})
