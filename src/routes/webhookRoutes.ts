import { Router } from "express";
import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController.ts";

const webhookRouter = Router();

webhookRouter.post("/stripe", express.raw({type: "application/json"}), handleStripeWebhook);

export default webhookRouter;