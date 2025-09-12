import { NextFunction, Request, Response } from "express";
import { IGlobalResponse } from "../interface/global.interface";

export const MErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error("Error:", err);

    const isDevelopment = process.env.NODE_ENV === "development";

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

        res.status(400).json(response);

    } else {
        const response: IGlobalResponse = {
            status: false,
            message: "An unknown error occurred",
            error: {
                message: "Internet server error",
                ...(isDevelopment && { detail: (err as any)?.stack ?? String(err) }),
            },
        };
        res.status(500).json(response);
    }
}