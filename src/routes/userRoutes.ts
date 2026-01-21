import type { Request, Response } from "express";
import { Router } from "express";
import {getUser} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get("/me", authMiddleware, getUser);
export default userRouter;