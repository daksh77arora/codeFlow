import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { submitCode, getUserSubmissions, getUserStats } from "../controllers/submissionController.js";

const router = express.Router();

router.post("/submit", protectRoute, submitCode);
router.get("/user", protectRoute, getUserSubmissions);
router.get("/stats", protectRoute, getUserStats);

export default router;
