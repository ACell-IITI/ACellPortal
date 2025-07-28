import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'NA',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    degreeBranchYear: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    linkedinId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Mentorship_db = mongoose.model('Mentorship_db', MentorSchema);

export default Mentorship_db;