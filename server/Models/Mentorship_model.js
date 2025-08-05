import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
    },
    graduationYear:{
      type:Number,
      required:true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    linkedinId: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Mentorship_db = mongoose.model('Mentorship_db', MentorSchema);

export default Mentorship_db;