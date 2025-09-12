import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { IGlobalResponse} from "../interface/global.interface";
import { ILoginResponse } from "../interface/auth.interface";
import { UGenerateToken } from "../utils/auth.utils"


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




