import express from "express";
import {
  addSponsor,
  getSponsors,
  deleteSponsor,
} from "../controllers/sponsorController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/sponsors", getSponsors);

router.post("/admin/add-sponsor", upload.single("logo"), addSponsor);
router.delete("/admin/delete-sponsor/:id", deleteSponsor);

export default router;
