import dotenv from "dotenv"

dotenv.config({ quiet: true }) // quite: true it will remove this line from terminal => [dotenv@17.2.3] injecting env (3) from .env

export const ENV = {
  PORT: process.env.MY_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
}



/*

(import dotenv from "dotenv"
dotenv.config() ) Or (import "dotenv/config") - both are same

*/
