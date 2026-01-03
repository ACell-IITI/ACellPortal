import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sponsor", sponsorSchema);
