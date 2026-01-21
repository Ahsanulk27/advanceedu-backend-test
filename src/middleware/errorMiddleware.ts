import type { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiError } from "../utils/ApiError.ts";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught:", err);

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ");
      return res.status(409).json({
        success: false,
        error: `Duplicate value for field: ${field || "unique field"}`,
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Record not found",
      });
    }

    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        error: "Invalid reference to related record",
      });
    }

    return res.status(400).json({
      success: false,
      error: "Database operation failed",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  }

  // Handle custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Handle Stripe errors
  if (err.type?.startsWith("Stripe")) {
    return res.status(400).json({
      success: false,
      error: "Payment processing error",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  }

  // Handle validation errors (if using express-validator or similar)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: err.message,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // Default internal server error
  return res.status(500).json({
    success: false,
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      details: err.message,
      stack: err.stack,
    }),
  });
};
