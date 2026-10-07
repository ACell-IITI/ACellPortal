import express from "express";
import {
  getTeamMembers,
  getAvailableYears,
  getTeamMemberByRollNo,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  bulkAddTeamMembers,
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
router.delete("/admin/:id", deleteTeamMember);
router.post("/admin/bulk-add", bulkAddTeamMembers);

export default router;
