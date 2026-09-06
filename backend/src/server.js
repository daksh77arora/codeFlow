import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import executionRoutes from "./routes/executionRoutes.js";

import http from "http";
import { Server } from "socket.io";
import fs from "fs";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("whiteboard-update", ({ roomId, update }) => {
    // Broadcast to everyone else in the room
    socket.to(roomId).emit("whiteboard-update", update);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials:true allows cookies with dynamically reflected origin
app.use(cors({ origin: true, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/execute", executionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  const possiblePaths = [
    path.join(__dirname, "../frontend/dist"),
    path.join(__dirname, "frontend/dist"),
    path.join(process.cwd(), "frontend/dist"),
    path.join(process.cwd(), "../frontend/dist"),
  ];
  const distDir = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

  app.use(express.static(distDir));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
