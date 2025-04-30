import express from "express";
import { protect } from "../middleware/authMiddleware";
import { resumeController } from "../controllers/resumeController";

const router = express.Router();

router.post("/", protect, (req, res, next) => {
  resumeController.createResume(req, res, next).catch(next);
});
router.get("/", protect, (req, res, next) => {
  resumeController.getResume(req, res, next).catch(next);
});
router.put("/", protect, (req, res, next) => {
  resumeController.updateResume(req, res, next).catch(next);
});
router.delete("/", protect, (req, res, next) => {
  resumeController.deleteResume(req, res, next).catch(next);
});
router.post("/generate-pdf", protect, (req, res, next) => {
  resumeController.generatePDF(req, res, next).catch(next);
});

export default router;