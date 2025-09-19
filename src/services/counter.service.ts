import { PrismaClient } from "@prisma/client";
import { HttpError } from "../utils/http.error";
import { IGlobalResponse } from "../interface/global.interface";
import {
  ICreateCounterResponse,
  IGetAllCountersResponse,
  IGetCounterResponse,
  IUpdateCounterResponse,
} from "../interface/counter.interface";

const prisma = new PrismaClient();

export const SGetAllCounters = async (): Promise<IGlobalResponse<IGetAllCountersResponse>> => {
  const counters = await prisma.counter.findMany({
    where: { deletedAt: null },
    orderBy: { id: "asc" },
  });
  return { status: true, message: "Counters retrieved successfully", data: { counters } };
};

export const SGetCounterById = async (id: number): Promise<IGlobalResponse<IGetCounterResponse>> => {
  const counter = await prisma.counter.findFirst({ where: { id, deletedAt: null } });
  if (!counter) {
    throw new HttpError(404, `Counter with ID ${id} not found`);
  }
  return { status: true, message: "Counter retrieved successfully", data: { counter } };
};

export const SCreateCounter = async (name: string, maxQueue?: number): Promise<IGlobalResponse<ICreateCounterResponse>> => {
  if (!name) {
    throw new HttpError(400, "Counter name is required");
  }

  const existingCounter = await prisma.counter.findUnique({ where: { name } });
  if (existingCounter) {
    throw new HttpError(409, `Counter with name "${name}" already exists`);
  }

  const counter = await prisma.counter.create({
    data: { name, maxQueue: maxQueue || 99 },
  });

  return { status: true, message: "Counter created successfully", data: { counter } };
};

export const SUpdateCounter = async (id: number, name?: string, maxQueue?: number): Promise<IGlobalResponse<IUpdateCounterResponse>> => {
  const counter = await prisma.counter.findFirst({ where: { id, deletedAt: null } });
  if (!counter) {
    throw new HttpError(404, `Counter with ID ${id} not found`);
  }

  if (name) {
    const existingName = await prisma.counter.findFirst({ where: { name, id: { not: id } } });
    if (existingName) {
      throw new HttpError(409, `Counter with name "${name}" already exists`);
    }
  }

  const updatedCounter = await prisma.counter.update({
    where: { id },
    data: { name, maxQueue },
  });

  return { status: true, message: "Counter updated successfully", data: { counter: updatedCounter } };
};

export const SUpdateCounterStatus = async (id: number, status: string): Promise<IGlobalResponse<IUpdateCounterResponse>> => {
  if (!["active", "inactive", "disable"].includes(status)) {
    throw new HttpError(400, "Invalid status value. Use 'active', 'inactive', or 'disable'.");
  }
    
  const counter = await prisma.counter.findUnique({ where: { id } });
  if (!counter) {
    throw new HttpError(404, `Counter with ID ${id} not found`);
  }
  
  let data: { isActive?: boolean; deletedAt?: Date | null } = {};
  if (status === "active") data = { isActive: true, deletedAt: null };
  else if (status === "inactive") data = { isActive: false };
  else if (status === "disable") data = { isActive: false, deletedAt: new Date() };

  const updatedCounter = await prisma.counter.update({ where: { id }, data });
  return { status: true, message: `Counter status updated to ${status}`, data: { counter: updatedCounter } };
};

export const SDeleteCounter = async (id: number): Promise<IGlobalResponse<null>> => {
  const counter = await prisma.counter.findFirst({ where: { id, deletedAt: null } });
  if (!counter) {
    throw new HttpError(404, `Counter with ID ${id} not found`);
  }
  
  await prisma.counter.update({
    where: { id },
    data: { isActive: false, deletedAt: new Date() },
  });

  return { status: true, message: "Counter deleted successfully", data: null };
};