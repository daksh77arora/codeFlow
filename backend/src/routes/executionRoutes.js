import express from "express";
import { runCode } from "../controllers/executionController.js";

const router = express.Router();

router.post("/", runCode);

export default router;