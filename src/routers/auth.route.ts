import { Router } from "express";
import { 
    CDelete, CLogin, CRegister, CUpdate 
} from "../controllers/auth.controller";

const router = Router();

// Auth Router (Merupakan Hasil Dari Tugas 1 yaitu Membuat Endpoint untuk Register, Update, Delete)
router.post(
    "/login", CLogin
);
router.post(
    "/create", CRegister
);
router.put(
    "/:id", CUpdate
);
router.delete(
    "/:id", CDelete
);

export default router;
