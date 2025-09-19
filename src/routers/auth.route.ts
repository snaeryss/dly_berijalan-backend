import { Router } from "express";
import { 
    CDelete, CGetAllAdmins, CLogin, CRegister, CUpdate 
} from "../controllers/auth.controller";
import { CachePresets, MCache } from "../middlewares/cache.middleware";
import { MValidate } from "../middlewares/validations.middleware";
import { MAuth } from "../middlewares/auth.middleware";
import { registerSchema, loginSchema, updateSchema } from "../middlewares/auth.validations.middleware";


const router = Router();

// Auth Router (Merupakan Hasil Dari Tugas 1 yaitu Membuat Endpoint untuk Register, Update, Delete)
router.post(
    "/login", MValidate(loginSchema),CLogin
);
router.post(
    "/create", MValidate(registerSchema),CRegister
);

router.use(MAuth); 

router.put(
    "/:id", MValidate(updateSchema), CUpdate
);
router.delete(
    "/:id", CDelete
);
router.get(
    "/", MCache (CachePresets.medium()), CGetAllAdmins
)

export default router;
