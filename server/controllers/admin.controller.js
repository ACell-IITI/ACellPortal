import cloudinary from '../config/cloudinary.js';
import KYA_db from '../models/KYA_model.js';
import bcrypt from "bcrypt";
import Mentorship_db from '../models/Mentorship_model.js';
import { Admin_db, Alumni_db } from '../models/User_model.js';
import Program from '../models/Program_model.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Newsletter from '../models/Newsletter_model.js';
import Magazine from '../models/Magazine_model.js';

// Add Newsletter
export const addNewsletter = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ message: 'PDF file required' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'newsletters',
      resource_type: 'raw', 
      access_mode: 'public',
    });
    fs.unlinkSync(req.file.path);

    const newsletter = new Newsletter({ title, pdfUrl: result.secure_url });
    await newsletter.save();

    res.status(201).json({ success: true, message: 'Newsletter uploaded', data: newsletter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get All Newsletters
export const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: newsletters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add Magazine
export const addMagazine = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ message: 'PDF file required' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'magazines',
      resource_type: 'raw',
      access_mode: 'public',
    });
    fs.unlinkSync(req.file.path);

    const magazine = new Magazine({ title, pdfUrl: result.secure_url });
    await magazine.save();

    res.status(201).json({ success: true, message: 'Magazine uploaded', data: magazine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get All Magazines
export const getMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: magazines });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get Latest Newsletter
export const getLatestNewsletter = async (req, res) => {
  try {
    const latestNewsletter = await Newsletter.findOne().sort({ createdAt: -1 });
    if (!latestNewsletter) {
      return res.status(404).json({ success: false, message: "No newsletter found" });
    }
    res.status(200).json({ success: true, data: latestNewsletter });
  } catch (err) {
    console.error("Error in getLatestNewsletter:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Latest Magazine
export const getLatestMagazine = async (req, res) => {
  try {
    const latestMagazine = await Magazine.findOne().sort({ createdAt: -1 });
    if (!latestMagazine) {
      return res.status(404).json({ success: false, message: "No magazine found" });
    }
    res.status(200).json({ success: true, data: latestMagazine });
  } catch (err) {
    console.error("Error in getLatestMagazine:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getAdminProfiles = async (req, res) => {
  try {
    // const appToken = req.cookies.appToken;

    // if (!appToken) {
    //   return res.status(401).json({ message: 'No token found' });
    // }

    // try {
    //   const decoded = jwt.verify(appToken, process.env.JWT_SECRET);
    // } catch (err) {
    //   return res.status(401).json({ message: 'Invalid or expired token' });
    // }

    const profilesList = await Admin_db.find()
      .select('-__v')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      data: profilesList,
    });
  } catch (error) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to get admins' });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    console.log(req.params.id);
    const profile = await Admin_db.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const { adminEmail, adminPassword } = req.body;

    if (adminEmail) {
      profile.AdminEmail = adminEmail;
    }

    if (adminPassword) {
      const salt = await bcrypt.genSalt(10);
      profile.AdminPassword = await bcrypt.hash(adminPassword, salt);
    }

    const updatedProfile = await profile.save();

    res.status(200).json({
      message: 'Admin profile updated successfully',
      admin: {
        _id: updatedProfile._id,
        adminEmail: updatedProfile.AdminEmail,
      },
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update admin profile' });
  }
};

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

    const { Name, Batch, CurrRole, Achievement, ShortBio,LinkedInPostLink } = req.body;

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
      LinkedInPostLink,
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

// export const getPendingMentors = async (req, res) => {
//   try {
//     const alumnis = await Alumni_db.find({ status: 'pending', role: 'alumni' });

//     const alumniEmails = alumnis.map((alumni) => alumni.alumniEmail);

//     const mentors = await Mentorship_db.find({ email: { $in: alumniEmails } });

//     const mentorMap = new Map();
//     mentors.forEach((mentor) => {
//       mentorMap.set(mentor.email, mentor);
//     });

//     const combined = alumnis.map((alumni) => ({
//       alumni,
//       mentor: mentorMap.get(alumni.alumniEmail) || null,
//     }));

//     return res.status(200).json(combined);
//   } catch (error) {
//     console.error('Error in getPendingMentors controller:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const verifyAlumni = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const alumni = await Alumni_db.findById(id);
//     if (!alumni) {
//       return res.status(404).json({ message: 'Alumni not found' });
//     }

//     if (alumni.status === 'pending') {
//       alumni.status = 'verified';
//       await alumni.save();
//       return res.status(200).json({ message: 'Alumni verified successfully' });
//     } else {
//       return res.status(400).json({ message: 'Alumni already verified' });
//     }
//   } catch (error) {
//     console.error('Error in verifyAlumni controller:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

//mentors part updated to admin

export const addMentorProfile = async (req, res) => {
  try {
    // const appToken = req.cookies.appToken;
    // if (!appToken) {
    //   return res.status(401).json({ message: 'No token found' });
    // }

    // try {
    //   const decoded = jwt.verify(appToken, process.env.JWT_SECRET);
    // } catch (err) {
    //   return res.status(401).json({ message: 'Invalid or expired token' });
    // }

    const {
      name,
      degree,
      graduationYear,
      // email,
      // contactNumber,
      linkedinId,
      skills,
      about,
    } = req.body;
    if (
      !name ||
      !degree ||
      !graduationYear ||
      // !email ||
      // !contactNumber ||
      !linkedinId ||
      !skills ||
      !about
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // const alumni = await Alumni_db.findOne({ alumniEmail: email });

    // if (!alumni) {
    //   return res.status(401).json({ message: 'Invalid Credentials' });
    // }

    // if (alumni.status === 'verified') {
    //   // If status is verified it means alumni is already a mentor
    //   return res.status(409).json({ message: 'Mentor already exists' });
    // }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'kya-profiles',
    });

    fs.unlinkSync(req.file.path);

    const mentorData = new Mentorship_db({
      name,
      degree,
      graduationYear,
      // email,
      // contactNumber,
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

// export const getMentorsProfile = async (req, res) => {
//   try {
//     const mentorsList = await Mentorship_db.find()
//       .select('-__v')
//       .sort({ createdAt: -1 });
//     res.json(mentorsList);
//   } catch (error) {
//     console.error(
//       'Error in getMentorsProfile under alumni controller: ',
//       error
//     );
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

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

// ADD program/event
export const addProgram = async (req, res) => {
  console.log('addProgram req.body:', req.body);
console.log('addProgram req.file:', req.file);
  try {
    const { type, title, date, time, venue } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'programs-events'
    });
    fs.unlinkSync(req.file.path);

    const program = new Program({
      type,
      image: result.secure_url,
      title,
      date,
      time,
      venue
    });

    await program.save();

    res.status(201).json({ success: true, message: 'Program/Event added', data: program });
  } catch (err) {
    console.error('Error in addProgram:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const programs = await Program.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: programs });
  } catch (err) {
    console.error('Error in getPrograms:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program/Event not found' });

    await Program.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Program/Event deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProgram:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

