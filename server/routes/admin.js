import express from 'express';
import {
  addKyaProfile,
  deleteKyaProfile,
  getKyaProfiles,
  getPendingMentors,
  verifyAlumni,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/add/kya-profile', addKyaProfile);
router.get('/get/kya-profiles', getKyaProfiles);
router.delete('/delete/kya-profile/:id', deleteKyaProfile);

router.get('/pending-mentors',getPendingMentors)
router.patch('/verify-alumni/:id',verifyAlumni)

export default router;
