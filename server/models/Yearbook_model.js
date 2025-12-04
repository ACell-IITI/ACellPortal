import mongoose from 'mongoose';

const yearbookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  publicId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Yearbook', yearbookSchema);

