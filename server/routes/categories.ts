import { count, eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { passwordCategories, passwordEntries } from '../schema.drizzle'

const categoryDto = createSelectSchema(passwordCategories)

const categoryAggregateDto = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  amount: z.number()
})

const categoryInputDto = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string()
})

export const list = forge
  .query({
    description: 'Get the list of password categories',
    output: {
      OK: z.array(categoryAggregateDto)
    }
  })
  .callback(async ({ db, response }) => {
    const rows = await db
      .select({
        id: passwordCategories.id,
        name: passwordCategories.name,
        color: passwordCategories.color,
        icon: passwordCategories.icon,
        amount: count(passwordEntries.id)
      })
      .from(passwordCategories)
      .leftJoin(
        passwordEntries,
        eq(passwordEntries.category, passwordCategories.id)
      )
      .groupBy(passwordCategories.id)

    return response.ok(rows)
  })

export const create = forge
  .mutation({
    description: 'Create a new password category',
    input: {
      body: categoryInputDto
    },
    output: {
      CREATED: categoryDto
    }
  })
  .callback(async ({ db, body, response }) => {
    const [result] = await db
      .insert(passwordCategories)
      .values(body)
      .returning()

    return response.created(result)
  })

export const update = forge
  .mutation({
    description: 'Update an existing password category',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), passwordCategories)
      }),
      body: categoryInputDto
    },
    output: {
      OK: categoryDto
    }
  })
  .callback(async ({ db, query: { id }, body, response }) => {
    const [result] = await db
      .update(passwordCategories)
      .set(body)
      .where(eq(passwordCategories.id, id))
      .returning()

    return response.ok(result)
  })

export const remove = forge
  .mutation({
    description: 'Delete a password category',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), passwordCategories)
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(passwordCategories).where(eq(passwordCategories.id, id))

    return response.ok(true)
  })
