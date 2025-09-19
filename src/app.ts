import express from "express";
import { MErrorHandler } from "./middlewares/error.middleware";
import authRouter from "./routers/auth.route";
import counterRouter from "./routers/counter.route";
import { connectRedis } from "./configs/redis.config";
import dotenv from "dotenv";

import { initializeCronJobs } from "./configs/sceduler.config";

connectRedis();
initializeCronJobs();
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/counter", counterRouter);

app.use(MErrorHandler)

app.listen(3000, () => {
  console.log("Server running in http://localhost:3000");
});