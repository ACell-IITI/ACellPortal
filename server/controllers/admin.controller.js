import cloudinary from '../config/cloudinary.js';
import KYA_db from '../Models/KYA_model.js';
import Mentorship_db from '../Models/Mentorship_model.js';
import { Alumni_db } from '../Models/User_model.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';

export const addKyaProfile = async (req, res) => {
  try {
    const appToken = req.cookies.appToken;

    if (!appToken) {
      return res.status(401).json({ message: 'No token found' });
    }

    try {
      const decoded = jwt.verify(appToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { Name, Batch, CurrRole, Achievement, ShortBio } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'kya-profiles',
    });

    fs.unlinkSync(req.file.path);

    const kyaData = new KYA_db({
      Name,
      Batch,
      CurrRole,
      Achievement,
      ShortBio,
      profilePic: result.secure_url,
    });

    await kyaData.save();

    res.status(201).json({ message: 'Profile created' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to add profile' });
  }
};

export const getKyaProfiles = async (req, res) => {
  try {
    const profilesList = await KYA_db.find()
      .select('-__v')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      data: profilesList,
    });
  } catch (error) {
    console.error('Error in getKyaProfiles:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYA profiles. Please try again later.',
    });
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
