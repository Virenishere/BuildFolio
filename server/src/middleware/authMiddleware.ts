import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userName: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || throwError("JWT_SECRET is not defined");

function throwError(message: string): never {
  throw new Error(message);
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token); // Log the token
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log("Decoded token:", decoded); // Log the decoded payload

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
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
    console.error("Protect middleware error:", error); // Log the error
    res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
    return;
  }
};