import { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { z } from "zod";
import User from "../models/userModel";
import Profile from "../models/profileModel";
import dotenv from "dotenv";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        userName: string;
      };
    }
  }
}

// Config
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || throwError("JWT_SECRET is not defined"),
  refreshSecret: process.env.REFRESH_SECRET || throwError("REFRESH_SECRET is not defined"),
  expiresIn: "15m",
  refreshExpiresIn: "7d",
};

// Utility function to throw error for missing env variables
function throwError(message: string): never {
  throw new Error(message);
}

// Utility functions
const generateToken = (payload: string | object | Buffer, secret: Secret, expiresIn: string | number): string => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, secret, options);
};

const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, userName } = req.body;

      const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "Email or username already exists",
        });
        return;
      }

      const user = await User.create({ email, password, userName });
      

      const accessToken = generateToken({ id: user._id.toString() }, JWT_CONFIG.secret, JWT_CONFIG.expiresIn);
      const refreshToken = generateToken(
        { id: user._id.toString() },
        JWT_CONFIG.refreshSecret,
        JWT_CONFIG.refreshExpiresIn
      );

      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        success: true,
        accessToken,
        user: { id: user._id.toString(), email: user.email, userName: user.userName },
      });
    } catch (error) {
      next(error);
    }
  },

  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      const accessToken = generateToken({ id: user._id.toString() }, JWT_CONFIG.secret, JWT_CONFIG.expiresIn);
      const refreshToken = generateToken(
        { id: user._id.toString() },
        JWT_CONFIG.refreshSecret,
        JWT_CONFIG.refreshExpiresIn
      );

      setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({
        success: true,
        accessToken,
        user: { id: user._id.toString(), email: user.email, userName: user.userName },
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: "No refresh token provided",
        });
        return;
      }

      const decoded = jwt.verify(refreshToken, JWT_CONFIG.refreshSecret) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
        return;
      }

      const accessToken = generateToken({ id: user._id.toString() }, JWT_CONFIG.secret, JWT_CONFIG.expiresIn);

      res.status(200).json({
        success: true,
        accessToken: accessToken,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
};