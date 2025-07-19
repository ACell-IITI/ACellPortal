import mongoose from 'mongoose';

// Alumni model
const AlumniSchema = new mongoose.Schema({
  AlumniEmail: {
    type: String,
    required: true,
  },
  AlumniPassword: {
    type: String,
    required: true,
  },
}, { timestamps: true });

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

const Alumni_db = mongoose.model('Alumni_db', AlumniSchema);
const Admin_db = mongoose.model('Admin_db', AdminSchema);

// Named export in ESM
export { Alumni_db, Admin_db };
