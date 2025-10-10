import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Newsletter', newsletterSchema);
