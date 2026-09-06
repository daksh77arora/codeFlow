import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // If user doesn't exist, create them automatically
      if (!user) {
        try {
          // Get user details from Clerk
          const clerkUser = await clerkClient.users.getUser(clerkId);

          const newUser = {
            clerkId: clerkId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
            profileImage: clerkUser.imageUrl || "",
          };

          // Create user in MongoDB
          user = await User.create(newUser);

          // Also create user in Stream
          await upsertStreamUser({
            id: clerkId,
            name: newUser.name,
            image: newUser.profileImage,
          });

          console.log("✅ Auto-created user:", newUser.email);
        } catch (createError) {
          console.error("Error auto-creating user:", createError);
          return res.status(500).json({ message: "Error creating user profile" });
        }
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
