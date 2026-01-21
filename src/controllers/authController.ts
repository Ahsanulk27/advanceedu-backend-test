import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError("Email and password are required", 400)
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      throw new ApiError("User with this email already exists", 409)
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({
      message: "user created successfully",
      user: { userId: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError("Email and Password are required", 400)
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new ApiError("Invalid user email", 401)
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError("Invalid password", 401)
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      message: "Sign in successful",
      token,
      user: {
        userId: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Sign out successful" });
};
