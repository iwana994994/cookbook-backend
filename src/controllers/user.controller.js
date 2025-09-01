import { clerkClient } from '@clerk/express';
import User from '../models/user.model.js';
import { connectDB } from '../config/db.js';
import { verifyToken } from '@clerk/clerk-sdk-node';

export const userSync = async (req, res) => {
  await connectDB();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const { payload } = await verifyToken(token, {
      secretKey: process.env.CLERK_JWT_KEY, // live JWT key iz Clerk dashboarda
    });

    const userId = payload.sub;

    // Proveri da li već postoji u MongoDB
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      return res.status(200).json({ user: existingUser, message: "User already exists" });
    }

    // Ako ne postoji, uzmi podatke iz Clerk-a
    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
      imageUrl: clerkUser.imageUrl || "",
      bannerUrl: clerkUser.imageUrl || "",
    };

    const user = await User.create(userData);

    res.status(201).json({ user, message: "User created successfully" });
  } catch (err) {
    console.error("User sync failed:", err);
    res.status(401).json({ error: "User sync failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  await connectDB();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const { payload } = await verifyToken(token, {
      secretKey: process.env.CLERK_JWT_KEY,
    });

    const userId = payload.sub;
    const user = await User.findOne({ clerkId: userId });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
