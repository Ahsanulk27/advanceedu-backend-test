import type { Response, NextFunction } from "express";
import { prisma } from "../config/db.ts";
import { OrderStatus } from "../generated/prisma/enums.ts";
import type { authRequest } from "../middleware/authMiddleware.ts";
import { ApiError } from "../utils/ApiError.ts";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.development") });

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment varibales");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createOrder = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError("Unquthorized", 401);
    }

    if (!productId) {
      throw new ApiError("Product ID is required", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100),
      currency: "usd",
      metadata: {
        userId,
        productId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      confirm: true,
      payment_method: "pm_card_visa",
      return_url: "https://example.com/order/return",
    });
    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        amount: product.price,
        status: OrderStatus.PENDING,
        stripePaymentIntentId: paymentIntent.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
    res.status(201).json({
      message: "Order created successfully",
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      amount: order.amount,
      status: order.status,
      product: order.product,
    });
  } catch (error) {
    console.log("Error creating error:", error);
    next(error);
  }
};

export const getUserOrders = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError("Unquthorized", 401);
    }
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      message: "Orders retrived successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleOrder = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError("Unquthorized", 401);
    }

    const { orderId } = req.params;
    if (!orderId || typeof orderId !== "string") {
      throw new ApiError("Invalid order ID", 400);
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    res.json({ message: "Order retrieved successfully", order });
  } catch (error) {
    next(error);
  }
};
