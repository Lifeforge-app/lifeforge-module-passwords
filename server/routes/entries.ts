import { asc, desc, eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { passwordEntries } from '../schema.drizzle'

const entryDto = createSelectSchema(passwordEntries)

const entryInputDto = z.object({
  name: z.string(),
  website: z.string(),
  username: z.string(),
  password: z.string(),
  icon: z.string(),
  color: z.string(),
  category: z.string().nullable().optional(),
  rotation_interval: z.number()
})

export const list = forge
  .query({
    description: 'Get all password entries with sorting',
    output: {
      OK: z.array(entryDto)
    }
  })
  .callback(async ({ db, response }) => {
    const rows = await db
      .select()
      .from(passwordEntries)
      .orderBy(desc(passwordEntries.pinned), asc(passwordEntries.name))

    return response.ok(rows)
  })

export const create = forge
  .mutation({
    description: 'Create a new password entry with pre-encrypted password',
    input: {
      body: entryInputDto
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, body, response }) => {
    await db.insert(passwordEntries).values({
      ...body,
      category: body.category || null,
      last_password_updated: new Date()
    })

    return response.noContent()
  })

export const update = forge
  .mutation({
    description: 'Update an existing password entry',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), passwordEntries)
      }),
      body: entryInputDto.extend({
        password_changed: z.boolean().optional()
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, body, response }) => {
    const { password_changed, ...rest } = body

    await db
      .update(passwordEntries)
      .set({
        ...rest,
        category: rest.category || null,
        updated: new Date(),
        ...(password_changed ? { last_password_updated: new Date() } : {})
      })
      .where(eq(passwordEntries.id, id))

    return response.noContent()
  })

export const remove = forge
  .mutation({
    description: 'Delete a password entry',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), passwordEntries)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(passwordEntries).where(eq(passwordEntries.id, id))

    return response.noContent()
  })

export const togglePin = forge
  .mutation({
    description: 'Toggle pin status of a password entry',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), passwordEntries)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const entry = (await db.query.entries.findFirst({ where: { id } }))!

    await db
      .update(passwordEntries)
      .set({ pinned: !entry.pinned, updated: new Date() })
      .where(eq(passwordEntries.id, id))

    return response.noContent()
  })
