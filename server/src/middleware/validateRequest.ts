import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);  // Validate req.body directly
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};

export default validateRequest;