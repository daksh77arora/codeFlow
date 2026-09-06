import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/", protectRoute, getLeaderboard);

export default router;
