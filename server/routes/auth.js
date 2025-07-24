import { Router } from "express";
import { adminLogin, adminSignUp, validateUser, alumniLogin, alumniSignUp, googleAuth } from "../controllers/authController.js";

const router = Router();

router.get('/check',validateUser)

router.post("/google", googleAuth)
router.post("/admin/signup", adminSignUp);
router.post("/admin/login", adminLogin);
router.post("/alumni/login", alumniLogin);
router.post("/alumni/signup", alumniSignUp);
export default router;