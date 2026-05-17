import AlumniContribution from "../models/AlumniContribution.js";
import fs from "fs";
import { uploadToOpeninary } from "../utils/openinary.js";

const openinaryUrl = process.env.OPENINARY_URL;

/**
 * @desc    Add new alumni contribution
 * @route   POST /admin/add-alumni-contribution
 */
export const addAlumniContribution = async (req, res) => {
  try {
    const { name, batch } = req.body;

    if (!name || !batch || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await uploadToOpeninary(
      req.file.path,
      "alumni-contributions",
    );

    fs.unlinkSync(req.file.path);

    const contribution = await AlumniContribution.create({
      name,
      batch: parseInt(batch),
      photo: openinaryUrl + result.files[0].url,
    });

    res.status(201).json(contribution);
  } catch (error) {
    console.error("Add Alumni Contribution Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all alumni contributions
 * @route   GET /api/alumni-contributions
 */
export const getAlumniContributions = async (req, res) => {
  try {
    const contributions = await AlumniContribution.find().sort({
      createdAt: -1,
    });
    res.status(200).json(contributions);
  } catch (error) {
    console.error("Get Alumni Contributions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete alumni contribution
 * @route   DELETE /admin/delete-alumni-contribution/:id
 */
export const deleteAlumniContribution = async (req, res) => {
  try {
    const contribution = await AlumniContribution.findById(req.params.id);

    if (!contribution) {
      return res.status(404).json({ message: "Alumni contribution not found" });
    }

    await contribution.deleteOne();

    res.status(200).json({ message: "Alumni contribution deleted" });
  } catch (error) {
    console.error("Delete Alumni Contribution Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
