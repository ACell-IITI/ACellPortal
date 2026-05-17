import express from "express";
import Gallery from "../models/Gallery.js";
import multer from "multer";
import fs from "fs";
import { uploadToOpeninary } from "../utils/openinary.js";
import upload from "../middleware/multer.js";

const router = express.Router();
const openinaryUrl = process.env.OPENINARY_URL;

// Add new photo
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file required",
      });
    }

    const result = await uploadToOpeninary(req.file.path, "alumni_gallery");
    fs.unlinkSync(req.file.path);
    const uploadedFile = result.files[0];

    const newPhoto = new Gallery({
      image: openinaryUrl + uploadedFile.url,
      publicId: uploadedFile.filename,
    });
    await newPhoto.save();

    res.status(201).json({
      success: true,
      data: newPhoto,
    });
  } catch (err) {
    console.error(err);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Get all photos
router.get("/", async (req, res) => {
  try {
    const photos = await Gallery.find().sort({
      createdAt: -1,
    });

    res.json(photos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Get recent photos
router.get("/recent", async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 }).limit(8);
    res.json(photos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Delete photo
router.delete("/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Photo deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
