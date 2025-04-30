import express from "express";
import { profileController } from "../controllers/profileController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/")
  .get(protect, profileController.getProfile)
  .put(protect, profileController.updateProfile);

export default router;