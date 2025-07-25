import mongoose from 'mongoose';

// Alumni model
const AlumniSchema = new mongoose.Schema(
  {
    alumniName: {
      type: String,
      required: true,
    },
    alumniEmail: {
      type: String,
      required: true,
    },
    alumniPassword: {
      type: String,
    },
    alumniProfilePic: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ['custom', 'google'],
      default: 'custom',
    },
    isInstituteEmail: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'pending',
    },
    role: {
      type: String,
      default: 'alumni',
    },
  },
  { timestamps: true }
);

// Admin model
const AdminSchema = new mongoose.Schema({
  AdminEmail: {
    type: String,
    required: true,
  },
  AdminPassword: {
    type: String,
    required: true,
  },
});

const Alumni_db =
  mongoose.models.Alumni_db || mongoose.model('Alumni_db', AlumniSchema);
const Admin_db =
  mongoose.models.Admin_db || mongoose.model('Admin_db', AdminSchema);

export { Alumni_db, Admin_db };
