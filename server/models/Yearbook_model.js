import mongoose from 'mongoose';

const yearbookOptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  imageUrl: { type: String },
  imagePublicId: { type: String }
});

const yearbookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdfUrl: { type: String }, // Optional fallback for single legacy link
  publicId: { type: String },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  options: [yearbookOptionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Yearbook', yearbookSchema);


