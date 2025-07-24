import mongoose from 'mongoose';

const CV_ReviewSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Roll_No: {
    type: Number,
    required: true,
  },
  Student_Email: {
    type: String,
    required: true,
  },
  CV_link: {
    type: String,
    required: true,
  },
  Target_Profile: {
    type: String,
    required: true
  }
}, { timestamps: true });

const CV_Review_db = mongoose.model('Mentorship_db', CV_ReviewSchema);

export default CV_Review_db;
