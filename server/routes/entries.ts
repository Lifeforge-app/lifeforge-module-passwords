import { v4 } from 'uuid'
import z from 'zod'

import forge from '../forge'
import passwordsSchemas from '../schema'
import { getDecryptedMaster } from '../utils/getDecryptedMaster'

let challenge = v4()

setInterval(() => {
  challenge = v4()
}, 1000 * 60)

export const getChallenge = forge
  .query()
  .description('Retrieve challenge token for password encryption')
  .input({})
  .callback(async () => challenge)

export const list = forge
  .query()
  .description('Get all password entries with sorting')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('entries')
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

export const create = forge
  .mutation()
  .description('Create a new encrypted password entry')
  .input({
    body: passwordsSchemas.entries
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
  .callback(
    async ({
      pb,
      body,
      core: {
        crypto: { encrypt, decrypt2, decrypt: _decrypt }
      }
    }) => {
      const { master, password, ...rest } = body

      const decryptedMaster = await getDecryptedMaster(
        pb,
        master,
        challenge,
        decrypt2
      )

      const decryptedPassword = decrypt2(password, challenge)

      const encryptedPassword = encrypt(
        Buffer.from(decryptedPassword),
        decryptedMaster
      )

      await pb.create
        .collection('entries')
        .data({
          ...rest,
          password: encryptedPassword.toString('base64')
        })
        .execute()
    }
  )

export const update = forge
  .mutation()
  .description('Update an existing password entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: passwordsSchemas.entries
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
    id: 'entries'
  })
  .callback(
    async ({
      pb,
      query: { id },
      body,
      core: {
        crypto: { encrypt, decrypt2, decrypt: _decrypt }
      }
    }) => {
      const { master, password, ...rest } = body

      const decryptedMaster = await getDecryptedMaster(
        pb,
        master,
        challenge,
        decrypt2
      )

      const decryptedPassword = decrypt2(password, challenge)

      const encryptedPassword = encrypt(
        Buffer.from(decryptedPassword),
        decryptedMaster
      )

      await pb.update
        .collection('entries')
        .id(id)
        .data({
          ...rest,
          password: encryptedPassword.toString('base64')
        })
        .execute()
    }
  )

export const decrypt = forge
  .mutation()
  .description('Decrypt and retrieve a password entry.')
  .input({
    query: z.object({
      id: z.string(),
      master: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .callback(
    async ({
      pb,
      query: { id, master },
      core: {
        crypto: { decrypt: _decrypt, encrypt2, decrypt2 }
      }
    }) => {
      const decryptedMaster = await getDecryptedMaster(
        pb,
        master,
        challenge,
        decrypt2
      )

      const password = await pb.getOne.collection('entries').id(id).execute()

      const decryptedPassword = _decrypt(
        Buffer.from(password.password, 'base64'),
        decryptedMaster
      )

      return encrypt2(decryptedPassword.toString(), challenge)
    }
  )

export const remove = forge
  .mutation()
  .description('Delete a password entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('entries').id(id).execute()
  )

export const togglePin = forge
  .mutation()
  .description('Toggle pin status of a password entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne.collection('entries').id(id).execute()

    await pb.update
      .collection('entries')
      .id(id)
      .data({
        pinned: !entry.pinned
      })
      .execute()
  })

export const exportEntries = forge
  .mutation()
  .description('Export all password entries decrypted')
  .input({
    body: z.object({
      master: z.string()
    })
  })
  .callback(
    async ({
      pb,
      body: { master },
      core: {
        crypto: { decrypt: _decrypt, decrypt2 }
      }
    }) => {
      const decryptedMaster = await getDecryptedMaster(
        pb,
        master,
        challenge,
        decrypt2
      )

      const entries = await pb.getFullList.collection('entries').execute()

      return entries.map(entry => {
        const decryptedPassword = _decrypt(
          Buffer.from(entry.password, 'base64'),
          decryptedMaster
        )

        return {
          ...entry,
          password: decryptedPassword.toString()
        }
      })
    }
  )
