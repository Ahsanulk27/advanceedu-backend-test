import type { Response, NextFunction } from "express";
import { prisma } from "../config/db";
import type { authRequest } from "../middleware/authMiddleware";
import { ApiError } from "../utils/ApiError";

export const getAllProducts = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      throw new ApiError("Name and Price are required", 400);
    }
    if (typeof price !== "number" || price <= 0) {
      throw new ApiError("Price must be a positive number", 400);
    }
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};
