import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import { createId } from '@paralleldrive/cuid2'
import { relations } from "drizzle-orm"

export const RoleEnum = pgEnum('role', ['user', 'admin'])

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  password: text('password'),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  twoFactorEnabled: boolean('twoFactorEnable').default(false),
  role : RoleEnum('role').default('user'),
  customerID: text('customerID')
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

export const passwordResetTokens = pgTable('password_reset_tokens',{
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

export const twoFactorTokens = pgTable('two_factor_tokens',{
  id: text("id").notNull().$defaultFn(() => createId()),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  email : text('email').notNull(),
  userID : text('userID').references(() => users.id, {onDelete : 'cascade'}),
},
(verificationToken) => ({
  compositePk: primaryKey({
    columns: [verificationToken.id, verificationToken.token],
  }),
})
)


export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  created: timestamp("created").defaultNow(),
  price: real("price").notNull(),
})

export const productVariant = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
})

export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariant.id, { onDelete: "cascade" }),
})


export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariant.id, { onDelete: "cascade" }),
})


export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariant, { relationName: "productVariants" }),
  reviews : many(reviews, {relationName : 'reviews'})
}))

export const productVariantsRelations = relations(
  productVariant,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariant.productID],
      references: [products.id],
      relationName: "productVariants",
    }),
    variantImages: many(variantImages, { relationName: "variantImages" }),
    variantTags: many(variantTags, { relationName: "variantTags" }),
  })
)

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariant, {
    fields: [variantImages.variantID],
    references: [productVariant.id],
    relationName: "variantImages",
  }),
}))

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariant, {
    fields: [variantTags.variantID],
    references: [productVariant.id],
    relationName: "variantTags",
  }),
}))

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  rating: real('rating').notNull(),
  userID: text('userID').notNull().references(() => users.id, {onDelete: 'cascade'}),
  productID: serial('productID').notNull().references(() => products.id, {onDelete: 'cascade'}),
  comment : text('comment').notNull(),
  create: timestamp('created').defaultNow()
}, (table) => {
  return {
    productIdx: index('productIdx').on(table.productID),
    userIdx: index('userIdx').on(table.userID)
  }
})


export const reviewRelation = relations(reviews, ({one}) => ({
  user: one(users, {
    fields: [reviews.userID],
    references: [users.id],
    relationName: 'iser_reviews',
  }),
  product: one(products, {
    fields: [reviews.productID],
    references: [products.id],
    relationName: 'reviews'
  })
}))

export const userRelations = relations(users, ({many}) => ({
  reviews : many(reviews, {relationName: 'user_reviews'}),
  orders : many(orders, {relationName : 'user_orders'})
}))

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userID: text('userID').notNull().references(() => users.id, {onDelete: 'cascade'}),
  total : real('total').notNull(),
  status : text('status').notNull(),
  created : timestamp('created').defaultNow(),
  receiptURL: text('receiptURL')
})

export const orderRelations = relations(orders, ({one, many}) => (
  {
    user: one(users, {
      fields: [orders.userID],
      references: [users.id],
      relationName: 'user_orders'
    }),
    orderProduct: many(orderProduct, {relationName : 'orderProduct'})
  }
))

export const orderProduct = pgTable('orderProduct', {
  id : serial('id').primaryKey(),
  quantity : integer('quantity').notNull(),
  productVariantID: serial('productVariantID').notNull()
  .references(() => productVariant.id, {onDelete: 'cascade'}),
  productID: serial('productID').notNull().references(() => products.id, {onDelete : 'cascade'}),
  orderID : serial('orderID').notNull().references(() => orders.id, {onDelete : 'cascade'})
})

export const orderProductRelations = relations(orderProduct, ({one}) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: 'orderProduct'
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: 'products'
  }),
  productVariants: one(productVariant, {
    fields: [orderProduct.productVariantID],
    references: [productVariant.id],
    relationName: 'productVariants'
  })
}))