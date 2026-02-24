import { pgTable, text, integer, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// ============= USERS TABLE ============= 

export const users = pgTable("users", {
  id: text("id").primaryKey(),  // here using clerkId as the user id
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});


// ================ PRODUCTS TABLE =============== 

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(), // generated automatically by database 

  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),

  price: integer("price").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),  // if you delete your user account it's going to delete all the products of that user 

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ================ COMMENTS TABLE =============== 

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),

  content: text("content").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ================= RELATIONS =============== 

// Users → Products & Comments
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products), 
  comments: many(comments), 
}));

// Products → User & Comments
export const productRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));


// Comments → User & Product
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
}));


// =============== TYPES (TYPE INFERENCE) ============== 

export type User = typeof users.$inferSelect;  // This creates a TypeScript type for data you SELECT from the database.
export type NewUser = typeof users.$inferInsert;  // This creates a TypeScript type for data you INSERT into the database.

export type Product = typeof products.$inferSelect; // This creates a TypeScript type for data you SELECT from the database.
export type NewProduct = typeof products.$inferInsert; // This creates a TypeScript type for data you INSERT into the database.

export type Comment = typeof comments.$inferSelect;  // This creates a TypeScript type for data you SELECT from the database.
export type NewComment = typeof comments.$inferInsert; // This creates a TypeScript type for data you INSERT into the database.

// ============= UPDATE TYPES (SAFE) =============
export type UpdateUser = Partial<
  Omit<NewUser, "id" | "createdAt" | "updatedAt">
>;

export type UpdateProduct = Partial<
  Omit<NewProduct, "id" | "userId" | "createdAt" | "updatedAt">
>;

export type UpdateComment = Partial<
  Omit<NewComment, "id" | "userId" | "productId" | "createdAt" | "updatedAt">
>;

/*

- Relations define how tables connect to each other. This enables Drizzle's query API to automatically join related data when using `with: { relationName: true }`

- Users Relations: A user can have many products and many comments `many()` means one user can have multiple related records

- Products Relations: a product belongs to one user and can have many comments `one()` means a single related record, `many()` means multiple related records

- fields = the foreign key column in THIS table (products.userId)
- references = the primary key column in the RELATED table (users.id)

- Comments Relations: A comment belongs to one user and one product
- comments.userId is the foreign key, users.id is the primary key

- One comment → one user
- comments.productId is the foreign key, products.id is the primary key

- $inferSelect → GET from DB
- $inferInsert → SEND to DB

- $inferSelect generates a type for rows returned from the database
- $inferInsert generates a type for inserting new records.

*/
