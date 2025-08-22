import express from 'express';
import { getMentors } from '../controllers/mentors.controller.js';
const router = express.Router();

router.get('/get',getMentors)

export default router;
