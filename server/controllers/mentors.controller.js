import Mentorship_db from '../models/Mentorship_model.js';
import { Alumni_db } from '../models/User_model.js';

export const getMentors = async (req, res) => {
  try {
    // const alumnis = await Alumni_db.find({
    //   role: 'alumni',
    // });
    // const alumniEmails = alumnis.map((alumni) => alumni.alumniEmail);

    const mentors = await Mentorship_db.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    return res.status(200).json(mentors);
  } catch (error) {
    console.error('Error in getVerifiedMentors controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
