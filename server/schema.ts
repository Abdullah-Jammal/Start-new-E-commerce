import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import { createId } from '@paralleldrive/cuid2'

export const RoleEnum = pgEnum('role', ['user', 'admin'])

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  password: text('password'),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  twoFactorEnabled: boolean('twoFactorEnable').default(false),
  role : RoleEnum('role').default('user')
})

export const accounts = pgTable("account", {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),                                        
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)


export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id").notNull().$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email : text('email').notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
)

