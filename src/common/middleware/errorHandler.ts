import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "validation_error",
      errors: err.issues.map((i) => ({ path: i.path, message: i.message })),
    });
  }

  console.error("🔥 Unexpected Error:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};