import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL!, 
  },
});


// add in the package.json file under the script section => "db:push": "drizzle-kit push"  then after run the below command

// npm run db:push => this command push data in neon db

// git branch → only local
// git branch -a → local + remote
// wc -l → counts lines (branches)