import express from "express";
import { MErrorHandler } from "./middlewares/error.middleware";
import authRouter from "./routers/auth.route";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use("/api/v1/auth", authRouter);

app.use(MErrorHandler)

app.listen(3000, () => {
  console.log("Server running in http://localhost:3000");
});