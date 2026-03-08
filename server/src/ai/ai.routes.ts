import { Router } from "express";
import { aiController } from "./ai.controller";
import { protect } from "../middleware/authMiddleware";
import { aiRateLimiter } from "../middleware/rateLimiter";

const router = Router();

/**
 * All AI routes are rate-limited with a stricter limit than standard API routes
 * because each call invokes Gemini (cost + latency).
 *
 * POST /api/ai/improve-bullet        — no auth required (stateless, no DB)
 * POST /api/ai/generate-summary      — auth required (needs user's resume)
 * POST /api/ai/ats-optimize          — auth required
 * POST /api/ai/suggest-skills        — auth required
 * POST /api/ai/rewrite-experience    — no auth required (stateless)
 */

router.post(
  "/improve-bullet",
  aiRateLimiter,
  (req, res, next) => aiController.improveBullet(req, res, next)
);

router.post(
  "/generate-summary",
  aiRateLimiter,
  protect,
  (req, res, next) => aiController.generateSummary(req, res, next)
);

router.post(
  "/ats-optimize",
  aiRateLimiter,
  protect,
  (req, res, next) => aiController.atsOptimize(req, res, next)
);

router.post(
  "/suggest-skills",
  aiRateLimiter,
  protect,
  (req, res, next) => aiController.suggestSkills(req, res, next)
);

router.post(
  "/rewrite-experience",
  aiRateLimiter,
  (req, res, next) => aiController.rewriteExperience(req, res, next)
);

export default router;
