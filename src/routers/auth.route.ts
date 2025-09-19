import { Router } from "express";
import { 
    CDelete, CGetAllAdmins, CLogin, CRegister, CUpdate 
} from "../controllers/auth.controller";
import { CachePresets, MCache } from "../middlewares/cache.middleware";


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
router.get(
    "/", MCache (CachePresets.medium()), CGetAllAdmins
)

export default router;
