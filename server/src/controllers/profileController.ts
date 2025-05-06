import { Request, Response, NextFunction } from "express";
import Profile from "../models/profileModel";
import User from "../models/userModel";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

// Extend Request interface to include Multer's file property
interface MulterRequest extends Request {
  file?: Express.Multer.File; 
}

dotenv.config();

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
          lastName: "User",
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
  },

  // Upload profile picture
  async uploadProfilePic(req: MulterRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
      }

      // Explicitly narrow the type to ensure TypeScript knows file is defined
      const file: Express.Multer.File = req.file;

      // Configure Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });

      // Upload buffer to Cloudinary and convert to WebP
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "profile-pictures",
            format: "webp",
            quality: 80,
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("Upload failed, no result returned"));
            resolve(result);
          }
        );
        uploadStream.end(file.buffer); 
      });

      // Update profile with new image URL
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        { profilePic: result.secure_url },
        { new: true }
      );

      if (!updatedProfile) {
        res.status(404).json({
          success: false,
          message: "Profile not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: "Profile picture uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};