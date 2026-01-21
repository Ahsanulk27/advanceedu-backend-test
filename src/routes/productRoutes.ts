import { Router } from "express";
import type { Request, Response } from "express";
import { getAllProducts, addProduct } from "../controllers/productController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const productRouter = Router();

productRouter.get("/", getAllProducts);

productRouter.post("/", authMiddleware, addProduct);

export default productRouter;
