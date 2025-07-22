import authRoutes from "./auth.js";
import adminRoute from './admin.js'
import alumniRoute from './alumni.js'
import { Router } from "express";

const router = Router();
router.use("/auth", authRoutes);
router.use("/admin",adminRoute);
router.use("/alumni",alumniRoute);

export default router;