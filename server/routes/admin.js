import express from "express";
import {
  addKyaProfile,
  deleteKyaProfile,
  getKyaProfiles,
  getPendingMentors,
  verifyAlumni,
  getAdminProfiles,
  updateAdminProfile
} from "../controllers/admin.controller.js";
import upload from "../middleware/multer.js";
import KYA_db from "../models/KYA_model.js";

const router = express.Router();

router.get("/get",getAdminProfiles);
router.patch("/update/:id",updateAdminProfile)

// KYA Profile Routes
router.post("/add-kya-profile", upload.single("profilePic"), addKyaProfile);
router.get("/get-kya-profiles", getKyaProfiles);
router.delete("/delete-kya-profile/:id", deleteKyaProfile);

// Admin Actions
router.get("/pending-mentors", getPendingMentors);
router.patch("/verify-alumni/:id", verifyAlumni);

export default router;
