import { Router } from "express";
import {
  validateUser,
  alumniLogin,
  alumniLogout,
} from "../controllers/authController.js";

const router = Router();

router.get("/check", validateUser);
router.post("/logout", alumniLogout);
// router.post("/google", googleAuth);
router.post("/alumni/login", alumniLogin);
// router.post("/alumni/signup", alumniSignUp);
export default router;
