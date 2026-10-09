import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true, index: true },
    year: { type: mongoose.Schema.Types.Mixed, required: true, index: true },
    team: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    group: {
      type: String,
      enum: ["Head", "Co-Head", "Team Lead", "Member", "Volunteer", "Advisor"],
      default: "Member",
    },
    priority_id: { type: Number, default: 1, index: true },
    sub_priority: { type: Number, default: 2 },
    image: { type: String, default: "" },
    branch: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    insta: { type: String, default: "", trim: true },
    contact: { type: String, default: "", trim: true },
    whyJoin: { type: String, default: "", trim: true },
    por: { type: String, default: "", trim: true },
    hobbies: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ year: 1, priority_id: 1, sub_priority: 1 });

export default mongoose.model("TeamMember", teamMemberSchema);
