import bcrypt from "bcrypt";
import { IGlobalResponse } from "../interface/global.interface";
import {
  IDeleteResponse,
  ILoginResponse,
  IRegisterResponse,
  IUpdateResponse,
} from "../interface/auth.interface";
import { UGenerateToken } from "../utils/auth.utils";
import { HttpError } from "../utils/http.error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Service Loginjnk 
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
    throw new HttpError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid credentials");
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
  const existingAdmin = await prisma.admin.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existingAdmin) {
    throw new HttpError(409, "Username or email already exists");
  }

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
  const existingAdmin = await prisma.admin.findUnique({ where: { id } });
  if (!existingAdmin) {
    throw new HttpError(404, `Admin with ID ${id} not found`);
  }

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
  const existingAdmin = await prisma.admin.findUnique({ where: { id } });
  if (!existingAdmin) {
    throw new HttpError(404, `Admin with ID ${id} not found`);
  }
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

export const SGetAllAdmins = async (): Promise<IGlobalResponse> => {
  const admins = await prisma.admin.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    status: true,
    message: "Admins retrieved successfully",
    data: admins,
  };
}
