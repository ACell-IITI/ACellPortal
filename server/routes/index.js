import authRoutes from "./auth.js";
import adminRoute from './admin.js'
import alumniRoute from './alumni.js'
import mentorsRoute from './mentors.js'
import cv_reviewRoute from './cv_review.js'
import { getAlumniContributions } from '../controllers/alumniContributionController.js'
import { Router } from "express";

const router = Router();
router.use("/auth", authRoutes);
router.use("/admin",adminRoute);
router.use("/alumni",alumniRoute);
router.use('/mentors',mentorsRoute);
router.use("/cv",cv_reviewRoute);

// Public route for alumni contributions
router.get("/alumni-contributions", getAlumniContributions);

export default router;
