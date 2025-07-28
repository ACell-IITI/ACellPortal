import Mentorship_db from "../Models/Mentorship_model.js";
import { Alumni_db } from "../Models/User_model.js";

export const getVerifiedMentors = async (req, res) => {
  try {
    const alumnis = await Alumni_db.find({ status: 'verified', role: 'alumni' });

    const alumniEmails = alumnis.map((alumni) => alumni.alumniEmail);

    const mentors = await Mentorship_db.find({ email: { $in: alumniEmails } });

    return res.status(200).json(mentors);
  } catch (error) {
    console.error('Error in getVerifiedMentors controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
