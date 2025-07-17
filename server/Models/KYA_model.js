import mongoose from 'mongoose';

const KYAschema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Batch: {
    type: Number,
    required: true,
  },
  CurrRole: {
    type: String,
    required: true,
  },
  Achievement: {
    type: String,
    required: true,
  },
  ShortBio: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const KYA_db = mongoose.model('KYA_db', KYAschema);

export default KYA_db;
