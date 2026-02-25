import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

// Get all comments
export const getAllComment = async (req: Request, res: Response) => {
  try {
    const comments = await queries.getAllComments();
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    return res.status(500).json({ error: "Failed to get comments" });
  }
};

// Get comment by ID
export const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!commentId || typeof commentId !== "string") {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await queries.getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error getting comment:", error);
    res.status(500).json({ error: "Failed to get comment" });
  }
};

// Get comments by User ID
export const getCommentsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const comments = await queries.getCommentsByUserId(userId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting user comments:", error);
    res.status(500).json({ error: "Failed to get user comments" });
  }
};

// Get comments by Product ID
export const getCommentsByProductId = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const comments = await queries.getCommentsByProductId(productId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting product comments:", error);
    res.status(500).json({ error: "Failed to get product comments" });
  }
};

// Create comment (protected)
export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { productId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Check if product exists
    const product = await queries.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const comment = await queries.createComment({
      content,
      userId,
      productId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// Update comment (protected - owner only)
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId || typeof commentId !== "string") {
      return res.status(400).json({ error: "Invalid comment ID" });
    }


    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const existingComment = await queries.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.userId !== userId) {
      return res.status(403).json({ error: "You can only update your own comments" });
    }

    const updatedComment = await queries.updateComment(commentId, {
      content,
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

// Delete comment (protected - owner only)
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { commentId } = req.params;

    if (!commentId || typeof commentId !== "string") {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const existingComment = await queries.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own comments" });
    }

    await queries.deleteComment(commentId);

    return res
        .status(200)
        .json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};



