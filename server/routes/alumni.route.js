import express from "express";
import {
  addMentorProfile,
  deleteMentorProfile,
  getMentorsProfile,
} from "../controllers/alumni.controller.js";

const router = express.Router();

router.post("/add/mentor-profile", addMentorProfile);
router.get("/get/mentor-profiles", getMentorsProfile);
router.delete("/delete/mentor-profile/:id", deleteMentorProfile);

export default router;
