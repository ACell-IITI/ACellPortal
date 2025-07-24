import KYA_db from '../Models/KYA_model.js';
import Mentorship_db from '../Models/Mentorship_model.js';
import { Alumni_db } from '../Models/User_model.js';

export const addKyaProfile = async (req, res) => {
  try {
    const { Name, Batch, CurrRole, Achievment, ShortBio } = req.body;
    if (!Name || !Batch || !CurrRole || !Achievment || !ShortBio) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingProfile = await KYA_db.findOne({
      Name,
      Batch,
      CurrRole,
      Achievment,
      ShortBio,
    });

    if (existingProfile) {
      return res.status(409).json({ message: 'This profile already exists.' });
    }

    const profile = new KYA_db({
      Name,
      Batch,
      CurrRole,
      Achievment,
      ShortBio,
    });

    await profile.save();

    return res.status(201).json({ message: 'KYA profile added successfully' });
  } catch (error) {
    console.error('Error in addKyaProfile under admin controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getKyaProfiles = async (req, res) => {
  try {
    const profilesList = await KYA_db.find().select('-__v');
    res.json(profilesList);
  } catch (error) {
    console.error('Error in getKyaProfiles under alumni controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteKyaProfile = async (req, res) => {
  try {
    const profile = await KYA_db.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'KYA profile not found' });
    }

    await KYA_db.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'KYA profile deleted successfully' });
  } catch (error) {
    console.error('Error in deleteKyaProfile under admin controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPendingMentors = async (req, res) => {
  try {
    const alumnis = await Alumni_db.find({ status: 'pending', role: 'alumni' });

    const alumniEmails = alumnis.map((alumni) => alumni.alumniEmail);

    const mentors = await Mentorship_db.find({ email: { $in: alumniEmails } });

    const mentorMap = new Map();
    mentors.forEach((mentor) => {
      mentorMap.set(mentor.email, mentor);
    });

    const combined = alumnis.map((alumni) => ({
      alumni,
      mentor: mentorMap.get(alumni.alumniEmail) || null,
    }));

    return res.status(200).json(combined);
  } catch (error) {
    console.error('Error in getPendingMentors controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyAlumni = async (req, res) => {
  try {
    const id = req.params.id;

    const alumni = await Alumni_db.findById(id); 
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    if (alumni.status === 'pending') {
      alumni.status = 'verified';
      await alumni.save(); 
      return res.status(200).json({ message: 'Alumni verified successfully' });
    } else {
      return res.status(400).json({ message: 'Alumni already verified' });
    }
  } catch (error) {
    console.error('Error in verifyAlumni controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
