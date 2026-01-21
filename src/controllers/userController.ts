import type { NextFunction, Response } from "express";
import { prisma } from "../config/db.ts";
import type { authRequest } from "../middleware/authMiddleware.ts";
import { ApiError } from "../utils/ApiError.ts";

export const getUser = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError("Unauthorized", 401);
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
