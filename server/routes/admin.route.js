import express from "express";
import {
  addKyaProfile,
  deleteKyaProfile,
  getKyaProfiles,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/add/kya-profile", addKyaProfile);
router.get("/get/kya-profiles", getKyaProfiles);
router.delete("/delete/kya-profile/:id", deleteKyaProfile);

export default router;
