import express from 'express';
import { getVerifiedMentors } from '../controllers/mentors.controller.js';
const router = express.Router();

router.get('/verified',getVerifiedMentors)

export default router;
