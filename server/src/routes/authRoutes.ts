import express from "express";
import { authController } from "../controllers/authController";
import { signinSchema, signupSchema } from "../middleware/authValidation";
import validateRequest from "../middleware/validateRequest";

const router = express.Router();

// Signup route
router.post(
  "/signup",
  validateRequest(signupSchema),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    authController.signup(req, res, next).catch(next);
  }
);

// Signin route
router.post(
  "/signin",
  validateRequest(signinSchema),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    authController.signin(req, res, next).catch(next);
  }
);

// Refresh token route
router.post(
  "/refresh-token",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    authController.refreshToken(req, res, next).catch(next);
  }
);

// Logout route
router.post("/logout", (req: express.Request, res: express.Response) => {
  authController.logout(req, res);
});

export default router;