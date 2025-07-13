import { Router } from "express";
import { adminLogin, adminSignUp, alumniLogin, alumniSignUp } from "../controllers/authController.js";

const router = Router();

router.post("/admin/signup", adminSignUp);
router.post("/admin/login", adminLogin);
router.post("/alumni/login", alumniLogin);
router.post("/alumni/signup", alumniSignUp);

export default router;