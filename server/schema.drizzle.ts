import { type RelationsBuilder } from 'drizzle-orm'
import {
  boolean,
  integer,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

const pgTable = createModuleTable()

export const passwordCategories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().default('').unique(),
  color: text('color').notNull().default(''),
  icon: text('icon').notNull().default('')
})

export const passwordEntries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().default(''),
  website: text('website').notNull().default(''),
  username: text('username').notNull().default(''),
  password: text('password').notNull().default(''),
  icon: text('icon').notNull().default(''),
  color: text('color').notNull().default(''),
  pinned: boolean('pinned').notNull().default(false),
  category: uuid('category').references(() => passwordCategories.id, {
    onDelete: 'set null'
  }),
  last_password_updated: timestamp('last_password_updated', { mode: 'date' })
    .notNull()
    .defaultNow(),
  rotation_interval: integer('rotation_interval').notNull().default(90),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const passwordConfig = pgTable('config', {
  id: uuid('id').defaultRandom().primaryKey(),
  master_hash: text('master_hash').notNull().default(''),
  wrapped_vek: text('wrapped_vek').notNull().default(''),
  recovery_wrapped_vek: text('recovery_wrapped_vek').notNull().default(''),
  pin_hash: text('pin_hash').notNull().default('')
})

export const tables = {
  entries: passwordEntries,
  categories: passwordCategories,
  config: passwordConfig
}

export const relations = (r: RelationsBuilder<typeof tables>) => ({
  categories: {
    entries: r.many.entries()
  },
  entries: {
    category_info: r.one.categories({
      from: r.entries.category,
      to: r.categories.id
    })
  }
})
