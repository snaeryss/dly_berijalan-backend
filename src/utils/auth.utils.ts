import jwt, { SignOptions } from "jsonwebtoken";

interface JWTPayload {
  id: number;
  username: string;
  email: string;
  name: string;
}

export function UGenerateToken(payload: JWTPayload): string {

  const secretKey = process.env.JWT_SECRET_KEY!;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  return jwt.sign(payload as object, secretKey, { expiresIn } as SignOptions);

}