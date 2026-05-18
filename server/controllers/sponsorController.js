import Sponsor from "../models/Sponsors.js";
import fs from "fs";
import { uploadToOpeninary } from "../utils/openinary.js";

const openinaryUrl = process.env.OPENINARY_URL;

/**
 * @desc    Add new sponsor
 * @route   POST /admin/add-sponsor
 */
export const addSponsor = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await uploadToOpeninary(req.file.path, "sponsors");

    fs.unlinkSync(req.file.path);

    const sponsor = await Sponsor.create({
      name,
      type,
      icon: openinaryUrl + result.files[0].url,
    });

    res.status(201).json(sponsor);
  } catch (error) {
    console.error("Add Sponsor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all sponsors
 * @route   GET /api/sponsors
 */
export const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ createdAt: -1 });
    res.status(200).json(sponsors);
  } catch (error) {
    console.error("Get Sponsors Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete sponsor
 * @route   DELETE /admin/delete-sponsor/:id
 */
export const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    await sponsor.deleteOne();
    res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Delete Sponsor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
