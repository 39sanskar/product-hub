import express from "express";
import cors from 'cors';
import {ENV} from "./config/env"
import { clerkMiddleware } from '@clerk/express'


const app = express();


// Middleware 
app.use(cors({ origin: ENV.FRONTEND_URL } ));
app.use(clerkMiddleware());  
app.use(express.json()); // parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // parses from data (like HTML forms).

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ProductHub API - Powered by PostgreSQL, Drizzle ORM and Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));




/*

app.use(clerkMiddleware());  // The clerkMiddleware() function checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the auth key.

*/
