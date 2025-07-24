import express from "express";
import {add_cv, get_cv} from "../controllers/cv_review.controller";

const router = express.Router();

router.post("/addCV",add_cv);
router.get("/getCV",get_cv);

export default router;
