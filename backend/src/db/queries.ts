import { db } from "./index";
import { eq } from "drizzle-orm";
import { 
  users, 
  comments, 
  products, 
  type NewUser, 
  type NewComment, 
  type NewProduct, 
} from "./schema";

// USER QUERIES
export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning(); // it return array so destructuring [user]
  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data:Partial<NewUser>) => { // Partial = all fields optional
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }

  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user; 
} // Find user by ID → update given fields → return updated user

// upsert => create or update (“upsert” means Update if exists, otherwise insert)

export const upsertUser = async (data: NewUser) => {
  // this is what we have done first
  // const existingUser = await getUserById(data.id);
  // if (existingUser) return updateUser(data.id, data);

  // return createUser(data);
  // On conflict do update
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning();
  return user;
}
// If user already exists → update it, If not → create new user


// PRODUCT QUERIES

// create product (price must be included in data)
export const createProduct = async (data: NewProduct) => {
  // data should include: title, description, imageUrl, price, userId
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProducts = async () => {
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)], // desc means: you will see the latest products first
    // the square brackets are required because Drizzle ORM's orderBy expects an array, even for a single column. 
  });
};

export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true }, // with: { relationName: true }
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
};

export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

// update product (price can also be updated)
export const updateProduct = async (
  id: string,
  data: Partial<NewProduct>
) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .update(products)
    .set(data) // can include price here
    .where(eq(products.id, id))
    .returning();

  return product;
};


export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  return product;
};


// COMMENT QUERIES

// create comment
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

// getallcomments
export const getAllComments = async () => {
  return db.query.comments.findMany({
    with: {
      user: true,
      product: true,
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  });
};

// getcommentbyId
export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: {
      user: true,
      product: true,
    },
  });
};

// getcommentbyUserId
export const getCommentsByUserId = async (userId: string) => {
  return db.query.comments.findMany({
    where: eq(comments.userId, userId),
    with: {
      user: true,
      product: true,
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  });
};

// getcommentbyProductId
export const getCommentsByProductId = async (productId: string) => {
  return db.query.comments.findMany({
    where: eq(comments.productId, productId),
    with: {
      user: true,
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  });
};


// update Comment
export const updateComment = async (
  id: string,
  data: Partial<NewComment>
) => {
  const existingComment = await getCommentById(id);

  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const [comment] = await db
    .update(comments)
    .set(data)
    .where(eq(comments.id, id))
    .returning();

  return comment;
};

// delete Comment
export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);

  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();

  return comment;
};

