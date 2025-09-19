import { Request, Response, NextFunction } from "express";
import {
  SCreateCounter,
  SDeleteCounter,
  SGetAllCounters,
  SGetCounterById,
  SUpdateCounter,
  SUpdateCounterStatus,
} from "../services/counter.service";
import { invalidateCounterCache } from "../middlewares/cache.middleware";

export const CGetAllCounters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SGetAllCounters();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGetCounterById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SGetCounterById(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CCreateCounter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, maxQueue } = req.body;
    const result = await SCreateCounter(name, maxQueue);

    await invalidateCounterCache();

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const CUpdateCounter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, maxQueue } = req.body;
    const result = await SUpdateCounter(Number(req.params.id), name, maxQueue);

    await invalidateCounterCache();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CUpdateCounterStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const result = await SUpdateCounterStatus(Number(req.params.id), status);

    await invalidateCounterCache();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CDeleteCounter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SDeleteCounter(Number(req.params.id));

    await invalidateCounterCache();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};