import express from "express";
import Gallery from "../models/Gallery.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// multer cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alumni_gallery", // ✅ folder in cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage });

// Add new photo
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newPhoto = new Gallery({
      image: req.file.path, // ✅ Cloudinary URL
    });
    await newPhoto.save();
    res.json(newPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all photos
router.get("/", async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get 5 most recent
router.get("/recent", async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 }).limit(8);
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete photo (optional: also delete from Cloudinary)
router.delete("/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
