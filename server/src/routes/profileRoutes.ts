import express from "express";
import { profileController } from "../controllers/profileController";
import { protect } from "../middleware/authMiddleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() }); // Use in-memory storage

const router = express.Router();

router
  .route("/")
  .get(protect, profileController.getProfile)
  .put(protect, profileController.updateProfile);

router
  .route("/upload")
  .post(protect, upload.single("profilePic"), profileController.uploadProfilePic);

export default router;