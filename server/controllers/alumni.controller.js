import bcrypt from 'bcrypt';
import { Alumni_db } from '../Models/User_model';
import Mentorship_db from '../Models/Mentorship_model';

export const addMentorProfile = async (req, res) => {
  try {
    const { AlumniEmail, AlumniPassword, LinkedIn_Id, Skills, Mentorship_Bio } =
      req.body;
    if (
      !LinkedIn_Id ||
      !AlumniEmail ||
      !AlumniPassword ||
      !Skills ||
      !Mentorship_Bio
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const alumni = await Alumni_db.findOne({ AlumniEmail });

    if (!alumni) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      AlumniPassword,
      alumni.AlumniPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    if (alumni.status === 'pending') {
      alumni.status = 'verified';
      await alumni.save();
    } else {
      // If status is verified it means alumni is already a mentor
      return res.status(409).json({ message: 'Mentor already exists' });
    }

    const mentorData = new Mentorship_db({
      LinkedIn_Id,
      Skills,
      Mentorship_Bio,
    });

    await mentorData.save();

    res.status(201).json({ message: 'Mentor added successfully' });
  } catch (error) {
    console.error('Error in addMentorProfile under alumni controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMentorsProfile = async (req, res) => {
  try {
    const mentorsList = await Mentorship_db.find().select('-__v');
    res.json(mentorsList);
  } catch (error) {
    console.error(
      'Error in getMentorsProfile under alumni controller: ',
      error
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMentorProfile = async (req, res) => {
  try {
    const profile = await Mentorship_db.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    await Mentorship_db.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error(
      'Error in deleteMentorProfile under alumni controller: ',
      error
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};
