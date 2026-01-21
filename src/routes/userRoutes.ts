import type { Request, Response } from "express";
import { Router } from "express";
import {getUser} from "../controllers/userController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const userRouter = Router();

userRouter.get("/me", authMiddleware, getUser);
export default userRouter;