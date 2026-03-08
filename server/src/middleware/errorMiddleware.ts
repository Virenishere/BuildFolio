import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface AppError extends Error {
  statusCode?: number;
  code?: number | string;
}

/**
 * Global error handler middleware.
 *
 * Express identifies an error-handling middleware by its 4-arg signature.
 * Must be registered AFTER all routes.
 *
 * Error shape:
 * - statusCode on the error object takes precedence over all
 * - Mongoose duplicate key errors (11000) map to 409
 * - Mongoose validation errors map to 422
 * - JWT errors map to 401
 * - Everything else → 500 with a generic message in production
 */
export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(err.message, {
    stack: err.stack,
    code: String(err.code ?? ""),
    statusCode: String(err.statusCode ?? ""),
  });

  let statusCode = err.statusCode ?? 500;
  let message = err.message ?? "Internal server error";

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate entry — this resource already exists";
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = err.message;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Not authorized — invalid or expired token";
  }

  // Hide internal details in production
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
