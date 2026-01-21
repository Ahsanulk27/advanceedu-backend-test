import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getSingleOrder,
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const orderRouter = Router();

orderRouter.get("/me", authMiddleware, getUserOrders);

orderRouter.post("/", authMiddleware, createOrder);

orderRouter.get("/:orderId", authMiddleware, getSingleOrder);
export default orderRouter;
