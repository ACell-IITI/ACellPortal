import express from "express";
import {
  addKyaProfile,
  deleteKyaProfile,
  getKyaProfiles,
  // getPendingMentors,
  // verifyAlumni,
  getAdminProfiles,
  updateAdminProfile,
  addMentorProfile,
  // getMentorsProfile,
  deleteMentorProfile
} from "../controllers/admin.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/get",getAdminProfiles);
router.patch("/update/:id",updateAdminProfile)

// KYA Profile Routes
router.post("/add-kya-profile", upload.single("profilePic"), addKyaProfile);
router.get("/get-kya-profiles", getKyaProfiles);
router.delete("/delete-kya-profile/:id", deleteKyaProfile);

// Admin Actions
// router.get("/pending-mentors", getPendingMentors);
// router.patch("/verify-alumni/:id", verifyAlumni);

// Mentor Profile Routes
router.post('/add-mentor', upload.single('profilePic'), addMentorProfile);
// router.get('/get-mentors/', getMentorsProfile);
router.delete('/delete-mentor/:id', deleteMentorProfile);

export default router;
