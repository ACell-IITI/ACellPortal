// import cloudinary from "../config/cloudinary.js";
import KYA_db from "../models/KYA_model.js";
import bcrypt from "bcrypt";
import Mentorship_db from "../models/Mentorship_model.js";
import { Admin_db, Alumni_db } from "../models/User_model.js";
import Program from "../models/Program_model.js";
import UpcomingEvent from "../models/UpcomingEvent_model.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Newsletter from "../models/Newsletter_model.js";
import Magazine from "../models/Magazine_model.js";
import EventProgram from "../models/Program_model.js";
import Yearbook from "../models/Yearbook_model.js";
import AnnualReport from "../models/AnnualReport_model.js";
// import { uploadToOpeninary } from "../utils/openinary.js";
import { uploadToR2, deleteFromR2 } from "../utils/s3.js";

// const openinaryUrl = process.env.OPENINARY_URL;

// Add Newsletter
export const addNewsletter = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "PDF file required" });

    // const result = await cloudinary.uploader.upload(req.file.path, {
    //   folder: "newsletters",
    //   resource_type: "raw",
    //   access_mode: "public",
    // });
    const result = await uploadToR2(req.file.path, "newsletters", req.file.originalname);
    
    fs.unlinkSync(req.file.path);

    const newsletter = new Newsletter({
      title,
      pdfUrl: result.url,
      publicId: result.objectKey,
    }); //added publicId here
    await newsletter.save();

    res.status(201).json({
      success: true,
      message: "Newsletter uploaded",
      data: newsletter,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete Newsletter
export const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      return res
        .status(404)
        .json({ success: false, message: "Newsletter not found" });
    }
    // const parts = newsletter.pdfUrl.split('/');
    // const fileName = parts[parts.length - 1].split('.')[0];
    // const publicId = `newsletters/${fileName}`;

    if (newsletter.publicId) {
      // await cloudinary.uploader.destroy(newsletter.publicId, {
      //   resource_type: "raw",
      // });
      await deleteFromR2(newsletter.publicId);
    }
    await Newsletter.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Newsletter deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Newsletters
export const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: newsletters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add Annual Report
export const addAnnualReport = async (req, res) => {
  try {
    const { title, driveLink } = req.body;

    if (!title || !driveLink) {
      return res.status(400).json({
        success: false,
        message: "Title and Drive Link are required"
      });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const result = await uploadToR2(
        req.file.path,
        "annual-reports",
        req.file.originalname
      );

      imageUrl = result.url;
      imagePublicId = result.objectKey;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const report = new AnnualReport({
      title,
      driveLink,
      imageUrl,
      imagePublicId
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Annual report added successfully",
      data: report
    });
  } catch (err) {
    console.error("Error adding annual report:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get Annual Reports
export const getAnnualReports = async (req, res) => {
  try {
    const reports = await AnnualReport.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Delete Annual Report
export const deleteAnnualReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await AnnualReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Annual report not found"
      });
    }

    if (report.imagePublicId) {
      await deleteFromR2(report.imagePublicId);
    }

    await AnnualReport.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Annual report deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Add Magazine
export const addMagazine = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "PDF file required" });

    // const result = await cloudinary.uploader.upload(req.file.path, {
    //   folder: "magazines",
    //   resource_type: "raw",
    //   access_mode: "public",
    // });
    const result = await uploadToR2(req.file.path, "magazines", req.file.originalname);
    fs.unlinkSync(req.file.path);

    const magazine = new Magazine({
      title,
      pdfUrl: result.url,
      publicId: result.objectKey,
    }); // publicId added here also
    await magazine.save();

    res
      .status(201)
      .json({ success: true, message: "Magazine uploaded", data: magazine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete Magazine
export const deleteMagazine = async (req, res) => {
  try {
    const { id } = req.params;

    const magazine = await Magazine.findById(id);
    if (!magazine) {
      return res
        .status(404)
        .json({ success: false, message: "Magazine not found" });
    }
    // const urlParts = magazine.pdfUrl.split('/');
    // const fileName = urlParts[urlParts.length - 1].split('.')[0];
    // const publicId = `magazines/${fileName}`;
    if (magazine.publicId) {
      // await cloudinary.uploader.destroy(magazine.publicId, {
      //   resource_type: "raw",
      // });
      await deleteFromR2(magazine.publicId);
    }
    await Magazine.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Magazine deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Get All Magazines
export const getMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: magazines });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Add Yearbook
export const addYearbook = async (req, res) => {
  try {
    const { title, options } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    let optionsList = [];
    let parsedOptions = [];
    if (typeof options === "string") {
      try {
        parsedOptions = JSON.parse(options);
      } catch (e) {
        parsedOptions = [];
      }
    } else if (Array.isArray(options)) {
      parsedOptions = options;
    }

    const files = req.files || [];

    for (let i = 0; i < parsedOptions.length; i++) {
      const opt = parsedOptions[i];
      let imageUrl = "";
      let imagePublicId = "";

      const matchingFile = files.find(f => f.fieldname === `option_image_${i}`) || files[i];
      if (matchingFile) {
        try {
          const result = await uploadToR2(matchingFile.path, "yearbooks", matchingFile.originalname);
          imageUrl = result.url;
          imagePublicId = result.objectKey;
        } catch (uploadErr) {
          console.error("R2 upload failed for file:", matchingFile.path, uploadErr);
        } finally {
          if (fs.existsSync(matchingFile.path)) {
            try { fs.unlinkSync(matchingFile.path); } catch (e) {}
          }
        }
      }

      optionsList.push({
        title: opt.title,
        pdfUrl: opt.pdfUrl || opt.link,
        imageUrl,
        imagePublicId
      });
    }

    const { link } = req.body;
    if (optionsList.length === 0 && link) {
      optionsList.push({
        title: title,
        pdfUrl: link,
        imageUrl: "",
        imagePublicId: ""
      });
    }

    const yearbook = new Yearbook({
      title,
      pdfUrl: link || (optionsList[0] ? optionsList[0].pdfUrl : ""),
      options: optionsList
    });
    await yearbook.save();

    res.status(201).json({ success: true, message: "Yearbook added successfully", data: yearbook });
  } catch (err) {
    console.error("Error in addYearbook:", err);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

// Add Option to an existing Yearbook
export const addYearbookOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pdfUrl, link } = req.body;

    const yearbook = await Yearbook.findById(id);
    if (!yearbook) {
      return res.status(404).json({ success: false, message: "Yearbook not found" });
    }

    const optionLink = pdfUrl || link;
    if (!title || !optionLink) {
      return res.status(400).json({ success: false, message: "Option title and link are required" });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      try {
        const result = await uploadToR2(req.file.path, "yearbooks", req.file.originalname);
        imageUrl = result.url;
        imagePublicId = result.objectKey;
      } catch (uploadErr) {
        console.error("R2 upload failed:", uploadErr);
      } finally {
        if (fs.existsSync(req.file.path)) {
          try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
      }
    }

    yearbook.options.push({
      title,
      pdfUrl: optionLink,
      imageUrl,
      imagePublicId
    });

    await yearbook.save();

    res.status(200).json({ success: true, message: "Yearbook option added", data: yearbook });
  } catch (err) {
    console.error("Error in addYearbookOption:", err);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

// Delete Option from a Yearbook
export const deleteYearbookOption = async (req, res) => {
  try {
    const { id, optionId } = req.params;

    const yearbook = await Yearbook.findById(id);
    if (!yearbook) {
      return res.status(404).json({ success: false, message: "Yearbook not found" });
    }

    const option = yearbook.options.id(optionId);
    if (!option) {
      return res.status(404).json({ success: false, message: "Option not found" });
    }

    if (option.imagePublicId) {
      await deleteFromR2(option.imagePublicId);
    }

    yearbook.options.pull(optionId);
    await yearbook.save();

    res.status(200).json({ success: true, message: "Option deleted successfully", data: yearbook });
  } catch (err) {
    console.error("Error in deleteYearbookOption:", err);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

// Delete Yearbook
export const deleteYearbook = async (req, res) => {
  try {
    const { id } = req.params;
    const yearbook = await Yearbook.findById(id);
    if (!yearbook) {
      return res
        .status(404)
        .json({ success: false, message: "Yearbook not found" });
    }

    if (yearbook.publicId) {
      await deleteFromR2(yearbook.publicId);
    }

    if (yearbook.coverImagePublicId) {
      await deleteFromR2(yearbook.coverImagePublicId);
    }

    if (yearbook.options && yearbook.options.length > 0) {
      for (const opt of yearbook.options) {
        if (opt.imagePublicId) {
          await deleteFromR2(opt.imagePublicId);
        }
      }
    }

    await Yearbook.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Yearbook deleted successfully" });
  } catch (err) {
    console.error("Error in deleteYearbook:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Yearbooks
export const getYearbooks = async (req, res) => {
  try {
    const yearbooks = await Yearbook.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: yearbooks });
  } catch (err) {
    console.error("Error in getYearbooks:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Latest Newsletter
export const getLatestNewsletter = async (req, res) => {
  try {
    const latestNewsletter = await Newsletter.findOne().sort({ createdAt: -1 });
    if (!latestNewsletter) {
      return res
        .status(404)
        .json({ success: false, message: "No newsletter found" });
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
      return res
        .status(404)
        .json({ success: false, message: "No magazine found" });
    }
    res.status(200).json({ success: true, data: latestMagazine });
  } catch (err) {
    console.error("Error in getLatestMagazine:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Latest Yearbook
export const getLatestYearbook = async (req, res) => {
  try {
    const latestYearbook = await Yearbook.findOne().sort({ createdAt: -1 });
    if (!latestYearbook) {
      return res
        .status(404)
        .json({ success: false, message: "No yearbook found" });
    }
    res.status(200).json({ success: true, data: latestYearbook });
  } catch (err) {
    console.error("Error in getLatestYearbook:", err);
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
      .select("-__v")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      data: profilesList,
    });
  } catch (error) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to get admins" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    console.log(req.params.id);
    const profile = await Admin_db.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Admin not found" });
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
      message: "Admin profile updated successfully",
      admin: {
        _id: updatedProfile._id,
        adminEmail: updatedProfile.AdminEmail,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update admin profile" });
  }
};

export const addKyaProfile = async (req, res) => {
  try {
    const appToken = req.cookies.appToken;

    if (!appToken) {
      return res.status(401).json({ message: "No token found" });
    }

    try {
      const decoded = jwt.verify(appToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { Name, Batch, CurrRole, Achievement, ShortBio, LinkedInPostLink } =
      req.body;

    // const result = await uploadToOpeninary(req.file.path, "kya-profiles");
    const result = await uploadToR2(req.file.path, "kya-profiles", req.file.originalname);

    fs.unlinkSync(req.file.path);

    const kyaData = new KYA_db({
      Name,
      Batch,
      CurrRole,
      Achievement,
      ShortBio,
      LinkedInPostLink,
      // profilePic: openinaryUrl + result.files[0].url,
      profilePic: result.url,
    });

    await kyaData.save();

    res.status(201).json({ message: "Profile created" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to add profile" });
  }
};

export const getKyaProfiles = async (req, res) => {
  try {
    const profilesList = await KYA_db.aggregate([
      {
        $addFields: {
          isEntrepreneur: {
            $regexMatch: {
              input: "$CurrRole",
              regex: /Founder|Co-Founder/i,
            },
          },
        },
      },
      {
        $sort: {
          isEntrepreneur: -1,
          createdAt: -1,
        },
      },
      {
        $project: {
          isEntrepreneur: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: profilesList,
    });
  } catch (error) {
    console.error("Error in getKyaProfiles:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch KYA profiles.",
    });
  }
};

export const deleteKyaProfile = async (req, res) => {
  try {
    const profile = await KYA_db.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "KYA profile not found" });
    }

    await KYA_db.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "KYA profile deleted successfully" });
  } catch (error) {
    console.error("Error in deleteKyaProfile under admin controller: ", error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(400).json({ message: "All fields are required." });
    }
    // const alumni = await Alumni_db.findOne({ alumniEmail: email });

    // if (!alumni) {
    //   return res.status(401).json({ message: 'Invalid Credentials' });
    // }

    // if (alumni.status === 'verified') {
    //   // If status is verified it means alumni is already a mentor
    //   return res.status(409).json({ message: 'Mentor already exists' });
    // }

    // const result = await uploadToOpeninary(req.file.path, "kya-profiles");
    const result = await uploadToR2(req.file.path, "mentor-profiles", req.file.originalname);

    fs.unlinkSync(req.file.path);

    const mentorData = new Mentorship_db({
      name,
      degree,
      graduationYear,
      // email,
      // contactNumber,
      linkedinId,
      skills: JSON.parse(skills),
      about,
      // profilePic: openinaryUrl + result.files[0].url,
      profilePic: result.url,
    });

    await mentorData.save();

    res.status(201).json({ message: "Thanks For Registration." });
  } catch (error) {
    console.error("Error in addMentorProfile under alumni controller: ", error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Mentor not found" });
    }

    await Mentorship_db.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (error) {
    console.error(
      "Error in deleteMentorProfile under alumni controller: ",
      error,
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

// ADD program/event
export const addProgram = async (req, res) => {
  console.log("addProgram req.body:", req.body);
  console.log("addProgram req.file:", req.file);
  try {
    const { type, title, date, time, venue, attendance, about } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file required" });
    }

    // const result = await uploadToOpeninary(req.file.path, "programs-events");
    const result = await uploadToR2(req.file.path, "programs-events", req.file.originalname);
    fs.unlinkSync(req.file.path);

    const program = new Program({
      type,
      // image: openinaryUrl + result.files[0].url,
      image: result.url,
      title,
      date,
      time,
      venue,
      attendance: attendance ? parseInt(attendance) : undefined,
      about,
    });

    await program.save();

    res
      .status(201)
      .json({ success: true, message: "Program/Event added", data: program });
  } catch (err) {
    console.error("Error in addProgram:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPrograms = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const programs = await Program.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: programs });
  } catch (err) {
    console.error("Error in getPrograms:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program)
      return res.status(404).json({ message: "Program/Event not found" });

    await Program.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Program/Event deleted successfully" });
  } catch (err) {
    console.error("Error in deleteProgram:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ADD upcoming event
export const addUpcomingEvent = async (req, res) => {
  console.log("addUpcomingEvent req.body:", req.body);
  console.log("addUpcomingEvent req.file:", req.file);
  try {
    const { title, date, venue } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file required" });
    }

    // const result = await uploadToOpeninary(req.file.path, "upcoming-events");
    const result = await uploadToR2(req.file.path, "upcoming-events", req.file.originalname);
    fs.unlinkSync(req.file.path);

    const upcomingEvent = new UpcomingEvent({
      // image: openinaryUrl + result.files[0].url,
      image: result.url,
      title,
      date,
      venue,
    });

    await upcomingEvent.save();

    res.status(201).json({
      success: true,
      message: "Upcoming Event added",
      data: upcomingEvent,
    });
  } catch (err) {
    console.error("Error in addUpcomingEvent:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await UpcomingEvent.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: upcomingEvents });
  } catch (err) {
    console.error("Error in getUpcomingEvents:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUpcomingEvent = async (req, res) => {
  try {
    const upcomingEvent = await UpcomingEvent.findById(req.params.id);
    if (!upcomingEvent)
      return res.status(404).json({ message: "Upcoming Event not found" });

    await UpcomingEvent.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Upcoming Event deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUpcomingEvent:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const aboutEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const eventDetails = await EventProgram.findById(id).select("-__v");
    if (!eventDetails) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: eventDetails,
    });
  } catch (error) {
    console.error("Error in aboutEvent:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event details",
    });
  }
};
