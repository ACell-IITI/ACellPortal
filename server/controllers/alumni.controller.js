import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Mentorship_db from '../Models/Mentorship_model.js';
import { Alumni_db } from '../Models/User_model.js';
import 'dotenv/config';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const addMentorProfile = async (req, res) => {
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

    const {
      name,
      degree,
      graduationYear,
      email,
      contactNumber,
      linkedinId,
      skills,
      about,
    } = req.body;
    if (
      !name ||
      !degree ||
      !graduationYear ||
      !email ||
      !contactNumber ||
      !linkedinId ||
      !skills ||
      !about
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const alumni = await Alumni_db.findOne({ alumniEmail: email });

    if (!alumni) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    if (alumni.status === 'verified') {
      // If status is verified it means alumni is already a mentor
      return res.status(409).json({ message: 'Mentor already exists' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'kya-profiles',
    });

    fs.unlinkSync(req.file.path);

    const mentorData = new Mentorship_db({
      name,
      degree,
      graduationYear,
      email,
      contactNumber,
      linkedinId,
      skills : JSON.parse(skills),
      about,
      profilePic: result.secure_url,
    });

    await mentorData.save();

    res.status(201).json({ message: 'Thanks For Registration.' });
  } catch (error) {
    console.error('Error in addMentorProfile under alumni controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMentorsProfile = async (req, res) => {
  try {
    const mentorsList = await Mentorship_db.find()
      .select('-__v')
      .sort({ createdAt: -1 });
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
