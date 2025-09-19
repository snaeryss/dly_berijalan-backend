import { Router } from "express";
import {
  CCreateCounter,
  CDeleteCounter,
  CGetAllCounters,
  CGetCounterById,
  CUpdateCounter,
  CUpdateCounterStatus,
} from "../controllers/counter.controller";
import { MAuth } from "../middlewares/auth.middleware";
import { MValidate } from "../middlewares/validations.middleware";
import {
  createCounterSchema,
  updateCounterSchema,
  updateStatusSchema,
} from "../middlewares/counter.validations.middleware";
import { CachePresets, MCache } from "../middlewares/cache.middleware";

const router = Router();

router.use(MAuth);

router.get("/", MCache(CachePresets.medium()), CGetAllCounters);
router.get("/:id", MCache(CachePresets.short()), CGetCounterById);
router.post("/create", MValidate(createCounterSchema), CCreateCounter);
router.put("/:id", MValidate(updateCounterSchema), CUpdateCounter);
router.patch("/:id/status", MValidate(updateStatusSchema), CUpdateCounterStatus);
router.delete("/:id", CDeleteCounter);

export default router;