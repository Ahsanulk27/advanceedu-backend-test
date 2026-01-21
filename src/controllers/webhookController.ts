import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.ts";
import { OrderStatus } from "../generated/prisma/enums.ts";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import { ApiError } from "../utils/ApiError.ts";

dotenv.config({ path: path.resolve(process.cwd(), ".env.development") });
if (!process.env.STRIPE_SECRET_KEY) {
  throw new ApiError(
    "Stripe secret key is not defined in environment variables",
    500
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new ApiError("Stripe webhook secret is not defined", 500);
  }
  if (!sig) {
    throw new ApiError("Stripe signature is missing", 400);
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    throw new ApiError("Webhook signature verification failed", 400);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const updateOrder = await prisma.order.update({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: OrderStatus.PAID,
          },
        });
        console.log(
          `Payment succeeded for order: ${updateOrder.id} | PaymentIntent: ${paymentIntent.id}`
        );
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const updateOrder = await prisma.order.update({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: OrderStatus.FAILED,
          },
        });
        console.log(
          `Payment failed for order: ${updateOrder.id} | PaymentIntent: ${paymentIntent.id}`
        );
        break;
      }
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.order.update({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: OrderStatus.FAILED,
          },
        });
        console.log(`Payment canceled: ${paymentIntent.id}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.log("Error handling webhook event:", error);
    res.status(500).json({
      error: "Webhook handler failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
