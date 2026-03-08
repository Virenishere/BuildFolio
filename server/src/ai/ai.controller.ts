import { Response, NextFunction } from "express";
import { z } from "zod";
import { aiService } from "./ai.service";
import { AuthRequest } from "../types/express";

// ── Zod schemas for request validation ────────────────────────────────────────

const improveBulletSchema = z.object({
  bullet: z.string().min(5, "Bullet must be at least 5 characters"),
  role: z.string().optional(),
  context: z.string().optional(),
});

const generateSummarySchema = z.object({
  targetRole: z.string().optional(),
});

const atsOptimizeSchema = z.object({
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
});

const suggestSkillsSchema = z.object({
  targetRole: z.string().optional(),
});

const rewriteExperienceSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company is required"),
});

// ── Controller ─────────────────────────────────────────────────────────────────

export const aiController = {
  async improveBullet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const parsed = improveBulletSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const result = await aiService.improveBullet(parsed.data);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async generateSummary(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
        return;
      }
      const parsed = generateSummarySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const result = await aiService.generateSummary({
        userId: req.user.id,
        targetRole: parsed.data.targetRole,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async atsOptimize(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
        return;
      }
      const parsed = atsOptimizeSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const result = await aiService.atsOptimize({
        userId: req.user.id,
        jobDescription: parsed.data.jobDescription,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async suggestSkills(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
        return;
      }
      const parsed = suggestSkillsSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const result = await aiService.suggestSkills({
        userId: req.user.id,
        targetRole: parsed.data.targetRole,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async rewriteExperience(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const parsed = rewriteExperienceSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const result = await aiService.rewriteExperience(parsed.data);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
