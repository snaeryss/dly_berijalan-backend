import { Router } from "express";
import {
  CCreateCounter,
  CDeleteCounter,
  CGetAllCounters,
  CGetCounterById,
  CUpdateCounter,
  CUpdateCounterStatus,
} from "../controllers/counter.controller";

const router = Router();

router.get("/", CGetAllCounters);
router.get("/:id", CGetCounterById);
router.post("/create", CCreateCounter);
router.put("/:id", CUpdateCounter);
router.patch("/:id/status", CUpdateCounterStatus);
router.delete("/:id", CDeleteCounter);

export default router;