import dotenv from "dotenv";
import express from "express";
import { MErrorHandler } from "./middlewares/error.middleware";
import authRouter from "./routers/auth.route";

dotenv.config();
const app = express();

app.use("/api/v1/auth", authRouter);

app.use(MErrorHandler)

