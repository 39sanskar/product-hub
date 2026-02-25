import express from "express";
import cors from 'cors';
import {ENV} from "./config/env"
import { clerkMiddleware } from '@clerk/express'

import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";
import productRoutes from "./routes/productRoutes";


const app = express();


// Middleware 
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true } ));
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


app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

const port = Number(ENV.PORT) || 3000;

app.listen(port, () => console.log("Server is up and running on PORT:", port));




/*

app.use(clerkMiddleware());  // The clerkMiddleware() function checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the auth key.

`credentials: true` allows the frontend to send cookies to the backend so that we can authenticate the user.
*/
