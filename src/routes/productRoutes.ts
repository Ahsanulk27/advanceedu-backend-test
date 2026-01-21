import { Router } from "express";
import type { Request, Response } from "express";
import { getAllProducts, addProduct } from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const productRouter = Router();

productRouter.get("/", getAllProducts);

productRouter.post("/", authMiddleware, addProduct);

export default productRouter;
