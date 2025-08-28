import { getAuth } from "@clerk/express";
import { connectDB } from '../config/db.js';
import Post from "../models/post.model.js";

import User from "../models/user.model.js";
export const createPost = async (req, res) => {
    await connectDB();

const {userId} = getAuth(req);
const user = await User.findOne({ clerkId: userId });

if (!user) return res.status(404).json({ error: "User not found" });

// get content

const {content} = req.body;

if (!content) return res.status(400).json({ error: "Content is required" });

// create post
const post = await Post.create({ user: user._id, content });

res.status(201).json({ post });

console.log(post, "   ❤ post created " );

};
export const getAllPost = async (req, res) => {

     await connectDB();
     const posts = await Post.find().populate("user").sort({ createdAt: -1 });
     res.status(200).json({ posts });

};

export const getPostById = async (req, res) => {
    await connectDB();
    const { id } = req.params;
    const post = await Post.findById(id).populate("user");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ post });
};