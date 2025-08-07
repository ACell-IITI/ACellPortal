import express from 'express';
import {
  addMentorProfile,
  deleteMentorProfile,
  getMentorsProfile,
} from '../controllers/alumni.controller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/add-mentor', upload.single('profilePic'), addMentorProfile);
router.get('/get-mentors/', getMentorsProfile);
router.delete('/delete-mentor/:id', deleteMentorProfile);

export default router;
