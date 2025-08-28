import { clerkClient } from '@clerk/express';
import User from '../models/user.model.js';
import { connectDB } from '../config/db.js';
import { getAuth } from '@clerk/express';


export const userSync = async (req, res) => {
    console.log('userSync route hit', req.auth);
  await connectDB();  // Ensure the database is connected before proceeding
      console.log('Connecting to MongoDB...');
   

   
       const { userId } = getAuth(req);

  // check if user already exists in mongodb
  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }
const clerkUser = await clerkClient.users.getUser(userId);
console.log('clerkUser   ', clerkUser);


           const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
      imageUrl: clerkUser.imageUrl||"",
  };

  const user = await User.create(userData);

  res.status(201).json({ user, message: "User created successfully" });
}

export const getCurrentUser = async (req, res) => {
  

  await connectDB();
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
};