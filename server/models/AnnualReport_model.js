import mongoose from 'mongoose';

const annualReportSchema = new mongoose.Schema({
  title: { type: String, required: true },

  // Google Drive link to the actual annual report
  driveLink: { type: String, required: true },

  // Cover image stored on R2
  imageUrl: { type: String },
  imagePublicId: { type: String },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('AnnualReport', annualReportSchema);