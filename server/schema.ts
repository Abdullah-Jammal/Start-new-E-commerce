import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
  id : uuid('id').primaryKey().notNull(),
  name : text('name').notNull()
})
