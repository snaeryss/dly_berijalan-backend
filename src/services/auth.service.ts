import bcrypt from "bcrypt";

import { IGlobalResponse} from "../interface/global.interface";
import { IDeleteResponse, ILoginResponse, IRegisterResponse, IUpdateResponse } from "../interface/auth.interface";
import { UGenerateToken } from "../utils/auth.utils"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Service Login
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

// Service Register
export const SRegister = async (
  username: string,
  password: string,
  email: string,
  name: string
): Promise<IGlobalResponse<IRegisterResponse>> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
      email,
      name,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const token = UGenerateToken({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
  });

  return {
    status: true,
    message: "Register success",
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

//Service Update
export const SUpdate = async (
  id: number,
  username: string,
  password: string,
  email: string,
  name: string
): Promise<IGlobalResponse<IUpdateResponse>> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      username,
      password: hashedPassword,
      email,
      name,
      updatedAt: new Date(),
    },
  });

  return {
    status: true,
    message: "Update success",
    data: {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

// Service Delete
export const SDelete = async (
  id: number
): Promise<IGlobalResponse<IDeleteResponse>> => {
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });

  return {
    status: true,
    message: "Delete success",
    data: {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};



