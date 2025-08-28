import express from "express"
import { createPost, getAllPost, getPostById, deletePost } from "../controllers/post.controller.js";

const router = express.Router();


router.post("/",createPost)
router.get("/",getAllPost)
router.get("/:id",getPostById)
router.delete("/:postId",deletePost)
export default router