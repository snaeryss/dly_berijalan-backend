import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { IGlobalResponse, ILoginResponse } from "../interface/global.interface";
import jwt, { SignOptions } from "jsonwebtoken";

const prisma = new PrismaClient();

export const SLogin = async (
  usernameOrEmail: string,
  password: string
): Promise<IGlobalResponse<ILoginResponse>> => {
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      isActive: true,
      deletedAt: null,
    },
  });

  if (!admin) {
    throw Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw Error("Invalid credentials");
  }

  const token = UGenerateToken({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
  });

  return {
    status: true,
    message: "Login successful",
    data: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

interface JWTPayload {
  id: number;
  username: string;
  email: string;
  name: string;
}

function UGenerateToken(payload: JWTPayload): string {
  const secretKey = process.env.JWT_SECRET_KEY!;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  return jwt.sign(payload as object, secretKey, { expiresIn } as SignOptions);

}
