import express from "express";
import { gptController } from "../controllers/gptControllers";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/enhance", protect, gptController.enhanceResume);
router.post("/generate", protect, gptController.generateResumeContent);

export default router;