import { Request, Response, NextFunction } from "express";
import Resume from "../models/resumeModel";
import dotenv from "dotenv";

dotenv.config();

// Define interface for authenticated user that matches your auth middleware
interface AuthenticatedUser {
  id: string;
  email: string;       // Made required to match your middleware
  userName: string;    // Made required to match your middleware
}

// Extend Express Request type for our authenticated routes
interface AuthRequest extends Request {
  user?: AuthenticatedUser;  // Keep optional as middleware might not always set it
}

export const resumeController = {
  async createResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
        return;
      }

      const resumeData = req.body;
      const resume = await Resume.create({
        userId: req.user.id,
        ...resumeData,
      });

      res.status(201).json({
        success: true,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  },

  async getResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
        return;
      }

      const resume = await Resume.findOne({ userId: req.user.id });

      if (!resume) {
        res.status(404).json({
          success: false,
          message: "Resume not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
        return;
      }

      const updateData = req.body;
      const resume = await Resume.findOneAndUpdate(
        { userId: req.user.id }, 
        updateData, 
        {
          new: true,
          runValidators: true,
        }
      );

      if (!resume) {
        res.status(404).json({
          success: false,
          message: "Resume not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated"
        });
        return;
      }

      const resume = await Resume.findOneAndDelete({ userId: req.user.id });

      if (!resume) {
        res.status(404).json({
          success: false,
          message: "Resume not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Resume deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async generatePDF(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      throw new Error("PDF generation not implemented yet");
    } catch (error) {
      next(error);
    }
  },
};