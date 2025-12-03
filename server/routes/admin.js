import express from "express";
import {
  addKyaProfile,
  deleteKyaProfile,
  getKyaProfiles,
  // getPendingMentors,
  // verifyAlumni,
  addProgram,
  getPrograms,
  deleteProgram,
  getAdminProfiles,
  updateAdminProfile,
  addMentorProfile,
  // getMentorsProfile,
  deleteMentorProfile
} from "../controllers/admin.controller.js";
import upload from "../middleware/multer.js";
import uploadPdf from '../middleware/pdfUpload.js';
import {
  addNewsletter,
  deleteNewsletter,
  getNewsletters,
  addMagazine,
  deleteMagazine,
  getMagazines,
  addYearbook,
  deleteYearbook,
  getYearbooks,
  getLatestNewsletter,
  getLatestMagazine,
  getLatestYearbook
} from '../controllers/admin.controller.js';

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

// Program/Event Routes
router.post('/add-program', upload.single('image'), addProgram);
router.get('/get-programs', getPrograms);
router.delete('/delete-program/:id', deleteProgram);

// Newsletter routes
router.post('/add-newsletter', uploadPdf.single('pdf'), addNewsletter);
router.get('/get-newsletters', getNewsletters);
router.delete('/delete-newsletter/:id', deleteNewsletter);

// Magazine routes
router.post('/add-magazine', uploadPdf.single('pdf'), addMagazine);
router.get('/get-magazines', getMagazines);
router.delete('/delete-magazine/:id', deleteMagazine);

// Yearbook routes
router.post('/add-yearbook', uploadPdf.single('pdf'), addYearbook);
router.get('/get-yearbooks', getYearbooks);
router.delete('/delete-yearbook/:id', deleteYearbook);

// Latest Newsletter & Magazine
router.get('/latest-newsletter', getLatestNewsletter);
router.get('/latest-magazine', getLatestMagazine);
router.get('/latest-yearbook', getLatestYearbook);

export default router;
