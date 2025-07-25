import express from 'express';
import {
  addMentorProfile,
  deleteMentorProfile,
  getMentorsProfile,
} from '../controllers/alumni.controller.js';

const router = express.Router();

router.post('/add-mentor', addMentorProfile);
router.get('/get-mentors/', getMentorsProfile);
router.delete('/delete-mentor/:id', deleteMentorProfile);

export default router;
