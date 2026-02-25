import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as commentController from "../controllers/commentController";

const router = Router();

// Get all comments
router.get("/", commentController.getAllComment);

// Specific routes first
router.get("/product/:productId", commentController.getCommentsByProductId);
router.get("/user/:userId", commentController.getCommentsByUserId);

// Get single comment
router.get("/:commentId", commentController.getCommentById);

// Create comment
router.post("/product/:productId", requireAuth, commentController.createComment);

// Update comment
router.patch("/:commentId", requireAuth, commentController.updateComment);

// Delete comment
router.delete("/:commentId", requireAuth, commentController.deleteComment);

export default router;



