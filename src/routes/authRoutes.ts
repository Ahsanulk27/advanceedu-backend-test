import type { Request, Response } from "express";
import { Router } from "express";
import {signup, signin, signout} from "../controllers/authController.ts"
const authRouter = Router();

authRouter.post("/sign-in", signin);

authRouter.post("/sign-up", signup);

authRouter.post("/sign-out", signout);

export default authRouter;
