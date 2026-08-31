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
  addUpcomingEvent,
  getUpcomingEvents,
  deleteUpcomingEvent,
  getAdminProfiles,
  updateAdminProfile,
  addMentorProfile,
  // getMentorsProfile,
  deleteMentorProfile,
  aboutEvent
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
  addYearbookOption,
  deleteYearbookOption,
  deleteYearbook,
  getYearbooks,
  getLatestNewsletter,
  getLatestMagazine,
  getLatestYearbook,
  addAnnualReport,
  deleteAnnualReport,
  getAnnualReports
} from '../controllers/admin.controller.js';
import {
  addAlumniContribution,
  getAlumniContributions,
  deleteAlumniContribution,
} from '../controllers/alumniContributionController.js';

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
router.get('/about-eventProgram/:id', aboutEvent);
router.get('/get-programs', getPrograms);
router.delete('/delete-program/:id', deleteProgram);

// Upcoming Event Routes
router.post('/add-upcoming-event', upload.single('image'), addUpcomingEvent);
router.get('/get-upcoming-events', getUpcomingEvents);
router.delete('/delete-upcoming-event/:id', deleteUpcomingEvent);

// Newsletter routes
router.post('/add-newsletter', uploadPdf.single('pdf'), addNewsletter);
router.get('/get-newsletters', getNewsletters);
router.delete('/delete-newsletter/:id', deleteNewsletter);

// Magazine routes
router.post('/add-magazine', uploadPdf.single('pdf'), addMagazine);
router.get('/get-magazines', getMagazines);
router.delete('/delete-magazine/:id', deleteMagazine);

// Annual Report routes
router.post('/add-annual-report', upload.single('image'), addAnnualReport);
router.get('/get-annual-reports', getAnnualReports);
router.delete('/delete-annual-report/:id', deleteAnnualReport);

// Yearbook routes
router.post('/add-yearbook', upload.any(), addYearbook);
router.post('/add-yearbook-option/:id', upload.single('coverImage'), addYearbookOption);
router.delete('/delete-yearbook-option/:id/:optionId', deleteYearbookOption);
router.get('/get-yearbooks', getYearbooks);
router.delete('/delete-yearbook/:id', deleteYearbook);

// Latest Newsletter & Magazine
router.get('/latest-newsletter', getLatestNewsletter);
router.get('/latest-magazine', getLatestMagazine);
router.get('/latest-yearbook', getLatestYearbook);

// Alumni Contribution routes
router.post('/add-alumni-contribution', upload.single('photo'), addAlumniContribution);
router.get('/get-alumni-contributions', getAlumniContributions);
router.delete('/delete-alumni-contribution/:id', deleteAlumniContribution);

export default router;
