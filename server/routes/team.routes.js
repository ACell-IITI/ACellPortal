import express from "express";
import {
  getTeamMembers,
  getAvailableYears,
  getTeamMemberByRollNo,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  deleteTeamYear,
  bulkAddTeamMembers,
  addTeamEdition,
  deleteTeamEdition,
} from "../controllers/team.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Public routes
router.get("/", getTeamMembers);
router.get("/years", getAvailableYears);
router.get("/member/:rollNo", getTeamMemberByRollNo);

// Admin / Management routes
router.post("/admin", upload.single("image"), addTeamMember);
router.put("/admin/:id", upload.single("image"), updateTeamMember);
// NOTE: /admin/year/:year MUST come before /admin/:id to avoid the wildcard catching "year"
router.delete("/admin/year/:year", deleteTeamYear);
router.delete("/admin/:id", deleteTeamMember);
router.post("/admin/bulk-add", bulkAddTeamMembers);
router.post("/admin/editions", addTeamEdition);
router.delete("/admin/editions/:name", deleteTeamEdition);

export default router;
