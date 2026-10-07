import TeamMember from "../models/TeamMember_model.js";
import { uploadToR2 } from "../utils/s3.js";
import fs from "fs";

// Get team members for a specific year (or latest year if not specified)
export const getTeamMembers = async (req, res) => {
  try {
    const availableYears = await TeamMember.distinct("year");
    availableYears.sort((a, b) => b - a);

    let year = req.query.year ? Number(req.query.year) : null;
    if (!year) {
      year = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
    }

    const members = await TeamMember.find({ year }).sort({
      priority_id: 1,
      sub_priority: 1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      year,
      availableYears,
      members,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team members",
      error: error.message,
    });
  }
};

// Get all distinct available years
export const getAvailableYears = async (req, res) => {
  try {
    const years = await TeamMember.distinct("year");
    years.sort((a, b) => b - a);
    res.status(200).json({ success: true, years });
  } catch (error) {
    console.error("Error fetching available years:", error);
    res.status(500).json({ success: false, message: "Failed to fetch years" });
  }
};

// Get single team member by roll number (fetches latest profile + all tenures)
export const getTeamMemberByRollNo = async (req, res) => {
  try {
    const { rollNo } = req.params;
    if (!rollNo) {
      return res.status(400).json({ success: false, message: "Roll number is required" });
    }

    const members = await TeamMember.find({
      rollNo: { $regex: new RegExp(`^${rollNo.trim()}$`, "i") },
    }).sort({ year: -1 });

    if (!members || members.length === 0) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    // Latest tenure is the first element
    res.status(200).json({
      success: true,
      member: members[0],
      allTenures: members,
    });
  } catch (error) {
    console.error("Error fetching member by roll number:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team member",
      error: error.message,
    });
  }
};

// Add a single team member
export const addTeamMember = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      year,
      team,
      role,
      group,
      priority_id,
      sub_priority,
      image,
      branch,
      linkedin,
      insta,
      contact,
      whyJoin,
      por,
      hobbies,
    } = req.body;

    if (!name || !rollNo || !year || !team || !role) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Name, Roll Number, Year, Team, and Role are required.",
      });
    }

    let finalImageUrl = image || "";
    if (req.file) {
      try {
        const uploadResult = await uploadToR2(
          req.file.path,
          "team",
          req.file.originalname
        );
        finalImageUrl = uploadResult.url;
      } catch (uploadErr) {
        console.error("R2 upload error:", uploadErr);
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    const newMember = new TeamMember({
      name,
      rollNo: String(rollNo).trim(),
      year: Number(year),
      team: String(team).trim(),
      role: String(role).trim(),
      group: group || "Member",
      priority_id: priority_id !== undefined && priority_id !== "" ? Number(priority_id) : 1,
      sub_priority: sub_priority !== undefined && sub_priority !== "" ? Number(sub_priority) : 2,
      image: finalImageUrl,
      branch: branch || "",
      linkedin: linkedin || "",
      insta: insta || "",
      contact: contact || "",
      whyJoin: whyJoin || "",
      por: por || "",
      hobbies: hobbies || "",
    });

    await newMember.save();

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      member: newMember,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error adding team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add team member",
      error: error.message,
    });
  }
};

// Update an existing team member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TeamMember.findById(id);
    if (!existing) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    let finalImageUrl = existing.image;
    if (req.file) {
      try {
        const uploadResult = await uploadToR2(
          req.file.path,
          "team",
          req.file.originalname
        );
        finalImageUrl = uploadResult.url;
      } catch (uploadErr) {
        console.error("R2 upload error:", uploadErr);
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    } else if (req.body.image !== undefined) {
      finalImageUrl = req.body.image;
    }

    const updateData = {
      ...(req.body.name && { name: req.body.name.trim() }),
      ...(req.body.rollNo && { rollNo: String(req.body.rollNo).trim() }),
      ...(req.body.year && { year: Number(req.body.year) }),
      ...(req.body.team && { team: req.body.team.trim() }),
      ...(req.body.role && { role: req.body.role.trim() }),
      ...(req.body.group && { group: req.body.group }),
      ...(req.body.priority_id !== undefined && { priority_id: Number(req.body.priority_id) }),
      ...(req.body.sub_priority !== undefined && { sub_priority: Number(req.body.sub_priority) }),
      image: finalImageUrl,
      ...(req.body.branch !== undefined && { branch: req.body.branch.trim() }),
      ...(req.body.linkedin !== undefined && { linkedin: req.body.linkedin.trim() }),
      ...(req.body.insta !== undefined && { insta: req.body.insta.trim() }),
      ...(req.body.contact !== undefined && { contact: req.body.contact.trim() }),
      ...(req.body.whyJoin !== undefined && { whyJoin: req.body.whyJoin.trim() }),
      ...(req.body.por !== undefined && { por: req.body.por.trim() }),
      ...(req.body.hobbies !== undefined && { hobbies: req.body.hobbies.trim() }),
    };

    const updated = await TeamMember.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      member: updated,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error updating team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update team member",
      error: error.message,
    });
  }
};

// Delete a team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }
    res.status(200).json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete team member",
      error: error.message,
    });
  }
};

// Bulk add team members (from parsed Excel / CSV)
export const bulkAddTeamMembers = async (req, res) => {
  try {
    const { members } = req.body;
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "An array of members is required for bulk upload.",
      });
    }

    const validMembers = [];
    const errors = [];

    members.forEach((m, idx) => {
      const rowNum = idx + 1;
      const name = m.name || m.Name;
      const rollNo = m.rollNo || m.RollNo || m.roll_no;
      const year = m.year || m.Year;
      const team = m.team || m.Team;
      const role = m.role || m.Role;

      if (!name || !rollNo || !year || !team || !role) {
        errors.push(`Row ${rowNum}: Missing mandatory fields (name, rollNo, year, team, or role)`);
        return;
      }

      validMembers.push({
        name: String(name).trim(),
        rollNo: String(rollNo).trim(),
        year: Number(year),
        team: String(team).trim(),
        role: String(role).trim(),
        group: m.group || m.Group || "Member",
        priority_id:
          m.priority_id !== undefined
            ? Number(m.priority_id)
            : m.Priority_ID !== undefined
            ? Number(m.Priority_ID)
            : 1,
        sub_priority:
          m.sub_priority !== undefined
            ? Number(m.sub_priority)
            : m.Sub_Priority !== undefined
            ? Number(m.Sub_Priority)
            : 2,
        image: m.image || m.Image || m.Image_URL || "",
        branch: m.branch || m.Branch || "",
        linkedin: m.linkedin || m.LinkedIn || "",
        insta: m.insta || m.Insta || m.Instagram || "",
        contact: m.contact || m.Contact || "",
        whyJoin: m.whyJoin || m.WhyJoin || m.Why_Join || "",
        por: m.por || m.POR || "",
        hobbies: m.hobbies || m.Hobbies || "",
      });
    });

    if (validMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid members found in the uploaded data.",
        errors,
      });
    }

    const inserted = await TeamMember.insertMany(validMembers);

    res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} team members.`,
      count: inserted.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error bulk adding team members:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk add team members",
      error: error.message,
    });
  }
};
