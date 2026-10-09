import TeamMember from "../models/TeamMember_model.js";
import TeamEdition from "../models/TeamEdition_model.js";
import { uploadToR2, processAndUploadImageUrl, deleteFromR2 } from "../utils/s3.js";
import fs from "fs";

// ─── Tenure & Year Sorting / Query Helpers ────────────────────────────────────

/**
 * Builds a query for matching the tenure / year field, whether stored as number or string.
 */
export const buildYearQuery = (yearParam) => {
  if (!yearParam) return null;
  const str = String(yearParam).trim();
  const num = Number(str);
  if (!isNaN(num) && str !== "") {
    return { $in: [num, str] };
  }
  return str;
};

/**
 * Sorts editions: numeric years descending (2027, 2026, 2025...), custom named editions first.
 */
export const sortEditions = (a, b) => {
  const strA = String(a).trim();
  const strB = String(b).trim();
  const numA = Number(strA);
  const numB = Number(strB);
  const isNumA = !isNaN(numA) && strA !== "";
  const isNumB = !isNaN(numB) && strB !== "";

  if (isNumA && isNumB) return numB - numA;
  if (!isNumA && !isNumB) return strA.localeCompare(strB);
  return isNumA ? 1 : -1;
};

// ─── Priority Auto-Assignment Helpers ────────────────────────────────────────

const STANDARD_TEAM_PRIORITIES = [
  { keys: ["alumni cell head", "overall head", "head", "heads", "council", "overall"], priority: 0 },
  { keys: ["web dev", "web development", "software", "tech", "technology"], priority: 1 },
  { keys: ["design", "graphic design", "ui/ux", "graphics"], priority: 2 },
  { keys: ["aram", "alumni relations", "annual alumni meet"], priority: 3 },
  { keys: ["logistics", "operations"], priority: 4 },
  { keys: ["newsletter", "editorial", "publications"], priority: 5 },
  { keys: ["content", "content writing"], priority: 6 },
  { keys: ["events", "event management"], priority: 7 },
  { keys: ["media", "photography", "videography"], priority: 8 },
  { keys: ["sponsorship", "finance"], priority: 9 },
  { keys: ["pr", "public relations"], priority: 10 },
];

export const ALLOWED_ROLES = ["Head", "Co-Head", "Team Lead", "Member", "Volunteer"];

/** Derives sub_priority from role string (0: Head, 1: Co-Head, 2: Team Lead, 3: Member, 4: Volunteer) */
export const deriveSubPriority = (role = "") => {
  const r = role.toLowerCase().trim();
  if (r.includes("advisor")) return 0;
  if ((r.includes("co") && r.includes("head")) || r === "co-head" || r === "cohead") return 1;
  if (r === "head" || r.endsWith(" head") || r.startsWith("head ") || r.includes(" head")) return 0;
  if (r.includes("lead")) return 2;
  if (r.includes("volunteer")) return 4;
  return 3; // Member
};

/** Derives Group enum value from role and team */
export const deriveGroup = (role = "", team = "") => {
  const r = role.toLowerCase().trim();
  const t = (team || "").toLowerCase().trim();
  if (r.includes("advisor") || t.includes("advisor")) return "Advisor";
  if ((r.includes("co") && r.includes("head")) || r === "co-head" || r === "cohead") return "Co-Head";
  if (
    r === "head" ||
    r.endsWith(" head") ||
    r.startsWith("head ") ||
    r.includes(" head") ||
    t === "alumni cell head" ||
    t === "overall head"
  ) {
    return "Head";
  }
  if (r.includes("lead")) return "Team Lead";
  if (r.includes("volunteer")) return "Volunteer";
  return "Member";
};

/**
 * Builds a team-name → priority_id map for a given year.
 * Existing DB assignments are respected; standard teams get standard priorities;
 * new teams get the next available id.
 */
export const buildTeamPriorityMap = async (members, year) => {
  const yearQuery = buildYearQuery(year);
  // Seed from existing DB records for this year
  const existing = await TeamMember.find({ year: yearQuery }, { team: 1, priority_id: 1 }).lean();
  const teamMap = new Map(); // normalised team name → priority_id

  for (const doc of existing) {
    const key = doc.team.toLowerCase().trim();
    if (!teamMap.has(key)) teamMap.set(key, doc.priority_id);
  }

  // Pre-seed standard priorities if not yet taken
  for (const st of STANDARD_TEAM_PRIORITIES) {
    for (const k of st.keys) {
      if (!teamMap.has(k)) {
        teamMap.set(k, st.priority);
      }
    }
  }

  // Determine current max priority in use
  let maxPriority = teamMap.size > 0 ? Math.max(...teamMap.values()) : 0;

  // Process teams from current upload batch
  for (const m of members) {
    const teamRaw = m.team || m.Team;
    if (!teamRaw) continue;
    const key = String(teamRaw).toLowerCase().trim();
    if (teamMap.has(key)) continue;

    // Check if key matches any standard team partially
    let matchedStandard = null;
    for (const st of STANDARD_TEAM_PRIORITIES) {
      if (st.keys.some((k) => key.includes(k) || k.includes(key))) {
        matchedStandard = st.priority;
        break;
      }
    }

    if (matchedStandard !== null) {
      teamMap.set(key, matchedStandard);
    } else {
      maxPriority++;
      teamMap.set(key, maxPriority);
    }
  }

  return teamMap;
};

// Get team members for a specific tenure / year
export const getTeamMembers = async (req, res) => {
  try {
    const memberYears = await TeamMember.distinct("year");
    const editions = await TeamEdition.find().lean();

    const allSet = new Set();
    memberYears.forEach((y) => {
      if (y !== undefined && y !== null && String(y).trim() !== "") {
        allSet.add(String(y).trim());
      }
    });
    editions.forEach((e) => {
      if (e.name && String(e.name).trim() !== "") {
        allSet.add(String(e.name).trim());
      }
    });

    const availableYears = Array.from(allSet);
    availableYears.sort(sortEditions);

    let year = req.query.year ? String(req.query.year).trim() : null;
    if (!year) {
      year = availableYears.length > 0 ? availableYears[0] : String(new Date().getFullYear());
    }

    const yearQuery = buildYearQuery(year);
    const members = await TeamMember.find({ year: yearQuery }).sort({
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

// Get all distinct available years and custom editions
export const getAvailableYears = async (req, res) => {
  try {
    const memberYears = await TeamMember.distinct("year");
    const editions = await TeamEdition.find().lean();

    const allSet = new Set();
    memberYears.forEach((y) => {
      if (y !== undefined && y !== null && String(y).trim() !== "") {
        allSet.add(String(y).trim());
      }
    });
    editions.forEach((e) => {
      if (e.name && String(e.name).trim() !== "") {
        allSet.add(String(e.name).trim());
      }
    });

    const years = Array.from(allSet);
    years.sort(sortEditions);

    res.status(200).json({ success: true, years });
  } catch (error) {
    console.error("Error fetching available years:", error);
    res.status(500).json({ success: false, message: "Failed to fetch years" });
  }
};

// Add a new tenure / custom edition name
export const addTeamEdition = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Tenure / Edition name is required." });
    }
    const trimmed = name.trim();
    const existing = await TeamEdition.findOne({ name: trimmed });
    if (!existing) {
      await TeamEdition.create({ name: trimmed });
    }
    res.status(201).json({
      success: true,
      message: `Edition '${trimmed}' added successfully.`,
      name: trimmed,
    });
  } catch (error) {
    console.error("Error adding team edition:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add edition",
      error: error.message,
    });
  }
};

// Delete a tenure / edition
export const deleteTeamEdition = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) return res.status(400).json({ success: false, message: "Edition name is required." });
    const trimmed = decodeURIComponent(name).trim();
    await TeamEdition.deleteOne({ name: trimmed });
    res.status(200).json({ success: true, message: `Edition '${trimmed}' removed.` });
  } catch (error) {
    console.error("Error deleting team edition:", error);
    res.status(500).json({ success: false, message: "Failed to delete edition" });
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

    const parsedYearNum = Number(year);
    const finalYear = !isNaN(parsedYearNum) && String(parsedYearNum) === String(year).trim() ? parsedYearNum : String(year).trim();

    const newMember = new TeamMember({
      name,
      rollNo: String(rollNo).trim(),
      year: finalYear,
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

    // Auto-register edition
    await TeamEdition.updateOne(
      { name: String(finalYear).trim() },
      { $setOnInsert: { name: String(finalYear).trim() } },
      { upsert: true }
    );

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
    let oldImageToDelete = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToR2(
          req.file.path,
          "team",
          req.file.originalname
        );
        finalImageUrl = uploadResult.url;
        if (existing.image && existing.image !== finalImageUrl) {
          oldImageToDelete = existing.image;
        }
      } catch (uploadErr) {
        console.error("R2 upload error:", uploadErr);
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    } else if (req.body.image !== undefined) {
      finalImageUrl = req.body.image;
      if (existing.image && existing.image !== finalImageUrl) {
        oldImageToDelete = existing.image;
      }
    }

    let updatedYear = undefined;
    if (req.body.year) {
      const parsedNum = Number(req.body.year);
      updatedYear = !isNaN(parsedNum) && String(parsedNum) === String(req.body.year).trim()
        ? parsedNum
        : String(req.body.year).trim();
      
      // Auto-register edition
      await TeamEdition.updateOne(
        { name: String(updatedYear).trim() },
        { $setOnInsert: { name: String(updatedYear).trim() } },
        { upsert: true }
      );
    }

    const updateData = {
      ...(req.body.name && { name: req.body.name.trim() }),
      ...(req.body.rollNo && { rollNo: String(req.body.rollNo).trim() }),
      ...(updatedYear !== undefined && { year: updatedYear }),
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

    // If photo was changed, delete previous photo from cloud storage
    if (oldImageToDelete) {
      try {
        const duplicateImage = await TeamMember.findOne({
          _id: { $ne: existing._id },
          image: oldImageToDelete,
        });
        if (!duplicateImage) {
          await deleteFromR2(oldImageToDelete);
        }
      } catch (cloudErr) {
        console.warn("[updateTeamMember] Failed to delete old image from cloud:", cloudErr.message);
      }
    }

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
    const existing = await TeamMember.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    // Delete photo from cloud storage (Cloudflare R2) if present
    if (existing.image) {
      try {
        const duplicateImage = await TeamMember.findOne({
          _id: { $ne: existing._id },
          image: existing.image,
        });

        if (!duplicateImage) {
          await deleteFromR2(existing.image);
        } else {
          console.log(`[deleteTeamMember] Image is still referenced by another member, skipping cloud delete.`);
        }
      } catch (cloudErr) {
        console.error(`[deleteTeamMember] Failed to delete image from cloud storage for member ${id}:`, cloudErr);
      }
    }

    await TeamMember.findByIdAndDelete(id);
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

// Delete ALL members for a given year / edition AND remove the edition record
export const deleteTeamYear = async (req, res) => {
  try {
    const { year } = req.params;
    if (!year) {
      return res.status(400).json({ success: false, message: "Year / edition name is required." });
    }
    const trimmed = decodeURIComponent(year).trim();
    const yearQuery = buildYearQuery(trimmed);

    // Fetch members to delete to clean up their images from cloud storage
    const membersToDelete = await TeamMember.find({ year: yearQuery }, { _id: 1, image: 1 });
    const memberIds = membersToDelete.map((m) => m._id);
    const uniqueImages = [...new Set(membersToDelete.map((m) => m.image).filter(Boolean))];

    // Delete photos from cloud storage (Cloudflare R2) in parallel if not used by any other members
    await Promise.allSettled(
      uniqueImages.map(async (imageUrl) => {
        try {
          const stillInUse = await TeamMember.findOne({
            _id: { $nin: memberIds },
            image: imageUrl,
          });
          if (!stillInUse) {
            await deleteFromR2(imageUrl);
          }
        } catch (cloudErr) {
          console.error(`[deleteTeamYear] Failed to delete image from cloud storage (${imageUrl}):`, cloudErr);
        }
      })
    );

    const result = await TeamMember.deleteMany({ year: yearQuery });
    // Also remove the edition record
    await TeamEdition.deleteOne({ name: trimmed });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} member(s) for '${trimmed}' and removed the edition tab.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting team year:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete team year",
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

    // Determine the tenure / year for this batch
    const yearFreq = {};
    for (const m of members) {
      const y = String(m.year || m.Year || m["Year of Joining"] || "").trim();
      if (y) yearFreq[y] = (yearFreq[y] || 0) + 1;
    }
    const batchYear =
      Object.keys(yearFreq).length > 0
        ? Object.keys(yearFreq).sort((a, b) => yearFreq[b] - yearFreq[a])[0]
        : String(new Date().getFullYear());

    // Build the team → priority_id map (DB-aware, respects existing assignments)
    const teamPriorityMap = await buildTeamPriorityMap(members, batchYear);

    const validMembers = [];
    const errors = [];
    const recordedEditions = new Set();

    for (let idx = 0; idx < members.length; idx++) {
      const m = members[idx];
      const rowNum = idx + 1;
      const name = m.name || m.Name || m["Full Name"] || m["full name"] || m.fullName;
      const rollNo = m.rollNo || m.RollNo || m.roll_no || m["Roll Number"] || m["Roll No"] || m["Roll no."];
      const rawYear = String(m.year || m.Year || m["Year of Joining"] || m.tenureYear || "").trim();
      const memberYear = rawYear !== "" ? rawYear : batchYear;
      const parsedNum = Number(memberYear);
      const year = !isNaN(parsedNum) && String(parsedNum) === memberYear ? parsedNum : memberYear;
      recordedEditions.add(String(year).trim());
      const team = m.team || m.Team || m["Team / Domain"] || m.domain;
      const role = m.role || m.Role || m.designation || m["Designation"] || m.position || m["Position"];

      if (!name || !rollNo || !team || !role) {
        errors.push(`Row ${rowNum}: Missing mandatory fields (name, rollNo, team, or role)`);
        continue;
      }

      // ── Auto-assign priority_id (use explicit value if provided, else derive from team) ──
      const rawPriority = m.priority_id ?? m.Priority_ID ?? m.Priority;
      const priority_id =
        rawPriority !== undefined && rawPriority !== "" && rawPriority !== null
          ? Number(rawPriority)
          : teamPriorityMap.get(String(team).toLowerCase().trim()) ?? 1;

      // ── Auto-assign sub_priority (use explicit value if provided, else derive from role) ──
      const rawSub = m.sub_priority ?? m.Sub_Priority ?? m.SubPriority;
      const sub_priority =
        rawSub !== undefined && rawSub !== "" && rawSub !== null
          ? Number(rawSub)
          : deriveSubPriority(String(role));

      // ── Auto-assign group from role and team if not explicitly set ──
      const group =
        m.group || m.Group
          ? (m.group || m.Group)
          : deriveGroup(String(role), String(team));

      // ── Process image — download from Drive and upload to R2 if needed ──
      const rawImageUrl =
        m.image ||
        m.Image ||
        m.Image_URL ||
        m["Image URL"] ||
        m["Upload your photo"] ||
        m["Photo"] ||
        m["Drive Link"] ||
        "";
      let finalImageUrl = "";
      try {
        finalImageUrl = await processAndUploadImageUrl(rawImageUrl, "team");
      } catch (imgErr) {
        console.warn(`[BulkUpload] Row ${rowNum}: Image processing failed — ${imgErr.message}`);
        finalImageUrl = rawImageUrl;
      }

      validMembers.push({
        name: String(name).trim(),
        rollNo: String(rollNo).trim(),
        year,
        team: String(team).trim(),
        role: String(role).trim(),
        group,
        priority_id,
        sub_priority,
        image: finalImageUrl,
        branch: m.branch || m.Branch || m["Branch / Department"] || m.department || "",
        linkedin: m.linkedin || m.LinkedIn || m["LinkedIn Profile URL"] || m.linkedinUrl || "",
        insta: m.insta || m.Insta || m.Instagram || m["Instagram Profile URL"] || m.instagramUrl || "",
        contact: m.contact || m.Contact || m["Contact Number"] || m.phone ? String(m.contact || m.Contact || m["Contact Number"] || m.phone) : "",
        whyJoin: m.whyJoin || m.WhyJoin || m.Why_Join || m["Why did you want to join Alumni Cell?"] || m["Why Join"] || "",
        por: m.por || m.POR || m["Your role / POR in Alumni Cell"] || m["Position of Responsibility"] || "",
        hobbies: m.hobbies || m.Hobbies || m["Hobbies & Interests"] || m["Hobbies and Interests"] || "",
      });
    }

    if (validMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid members found in the uploaded data.",
        errors,
      });
    }

    const inserted = await TeamMember.insertMany(validMembers);

    // Auto-register editions
    for (const ed of recordedEditions) {
      if (ed) {
        await TeamEdition.updateOne(
          { name: String(ed).trim() },
          { $setOnInsert: { name: String(ed).trim() } },
          { upsert: true }
        );
      }
    }

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
