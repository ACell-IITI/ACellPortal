import mongoose from 'mongoose';

const CV_ReviewSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Student_Email: {
    type: String,
    required: true,
  },
  CV: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const CV_Review_db = mongoose.model('Mentorship_db', CV_ReviewSchema);

export default CV_Review_db;
