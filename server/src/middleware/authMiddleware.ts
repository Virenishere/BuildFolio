import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import dotenv from "dotenv";
import { AuthRequest } from "../types/express";

dotenv.config();

function throwError(message: string): never {
  throw new Error(message);
}

const JWT_SECRET =
  process.env.JWT_SECRET || throwError("JWT_SECRET is not defined");

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized — no token provided",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Not authorized — user not found",
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      userName: user.userName,
    };

    next();
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const isExpired = name === "TokenExpiredError";
    res.status(401).json({
      success: false,
      message: isExpired
        ? "Not authorized — token expired"
        : "Not authorized — invalid token",
    });
  }
};
