import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV ?? "development";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import webhookRouter from "./routes/webhookRoutes";

const app = express();
const PORT = process.env.PORT;
app.use("/api/v1/webhooks", webhookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running!");
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`API is running on localhost:${PORT}`);
});

export default app;
