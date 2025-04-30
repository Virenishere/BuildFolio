import { Request, Response, NextFunction } from "express";
import Profile from "../models/profileModel";
import User from "../models/userModel";

export const profileController = {
  // Get or create profile
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
      }

      let profile = await Profile.findOne({ userId });
      
      if (!profile) {
        const user = await User.findById(userId);
        profile = await Profile.create({
          userId,
          firstName: user?.userName || "New",
          lastName: "User"
        });
      }

      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },

  // Update profile
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedProfile) {
        res.status(404).json({ success: false, message: "Profile not found" });
        return;
      }

      res.status(200).json({ success: true, data: updatedProfile });
    } catch (error) {
      next(error);
    }
  }
};