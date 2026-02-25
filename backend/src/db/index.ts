import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

// initialize PostgreSQL connection pool
const pool = new Pool({ connectionString: ENV.DATABASE_URL }); // bydefault this is equal to 10, if you want to increment then max and update the value.

// log when first connection is made
 // log when first connection is made
pool.on("connect", () => {
  console.log("Database connected successfully!");
});

// log unexpected errors on the pool
pool.on("error", (err: Error) => {
  console.error("Unexpected error in PostgreSQL connection pool", err);

  if (process.env.NODE_ENV === "production") {
    // Fail fast in production so the process manager can restart with a healthy pool
    process.exit(1);
  }
});


export const db = drizzle({ client: pool, schema }); // db is the variable we will be use in the future.


/*

- What is a Connection Pool?
- A connection pool is a cache of database connections that are kept open and reused.

- Why use it?
- Opening/closing connections is slow. Instead of creating a new connection for each request, we reuse existing ones.
- Databases limit concurrent connections. A pool manages a fixed number of connections and shares them across requests.

*/




