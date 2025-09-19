import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/http.error";

interface JwtPayload {
  id: number;
  username: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

export const MAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, "Akses ditolak. Token tidak ditemukan."));
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    console.error("JWT_SECRET_KEY tidak diatur di file .env");
    return next(new HttpError(500, "Kesalahan konfigurasi server."));
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.admin = decoded; 

    next();
  } catch (error) {
    return next(new HttpError(401, "Token tidak valid atau telah kedaluwarsa."));
  }
};