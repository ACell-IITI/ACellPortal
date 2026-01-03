import mongoose from "mongoose";

const alumniContributionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AlumniContribution", alumniContributionSchema);