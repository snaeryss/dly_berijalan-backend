import { NextFunction, Request, Response } from "express";
import { IGlobalResponse } from "../interface/global.interface";
import { HttpError } from "../utils/http.error";

export const MErrorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";

  // Error Handling Ini Waktu Http Error
  if (err instanceof HttpError) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message,
      error: {
        message: err.message,
        ...(isDevelopment && { stack: err.stack }),
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // Error Handling untuk Error Umum
  if (err instanceof Error) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message,
    };
    const errorObj: any = { message: err.message };
    if (err.name) {
      errorObj.name = err.name;
    }
    if (isDevelopment && err.stack) {
      errorObj.stack = err.stack;
    }
    response.error = errorObj;
    res.status(400).json(response); // Untuk error umum, 400 sudah cukup baik
    return;
  }

  // Unknown Error Handling
  const response: IGlobalResponse = {
    status: false,
    message: "An unknown error occurred",
    error: {
      message: "Internal server error",
      ...(isDevelopment && { detail: (err as any)?.stack ?? String(err) }),
    },
  };
  res.status(500).json(response);
};
