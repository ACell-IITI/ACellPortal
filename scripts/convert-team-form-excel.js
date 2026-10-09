#!/usr/bin/env node

/**
 * convert-team-form-excel.js
 * 
 * Converts raw Google Form responses (Excel or CSV) into the standardized
 * Alumni Cell Team bulk-upload format.
 * 
 * Auto-assigns:
 * - Priority_ID (Overall Head: 0, Web Dev: 1, Design: 2, ARAM: 3, Logistics: 4, Newsletter: 5, Content: 6, ...)
 * - Sub_Priority (Head: 0, Co-Head: 1, Team Lead: 2, Core Member: 3, Member: 4)
 * - Group (Head, Co-Head, Member, Advisor)
 * 
 * Usage:
 *   node scripts/convert-team-form-excel.js <input-file.xlsx> [output-file.xlsx] [year]
 * 
 * Example:
 *   node scripts/convert-team-form-excel.js responses.xlsx standardized_team.xlsx 2026
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let XLSX;
try {
  XLSX = require("xlsx");
} catch {
  // Try client node_modules if running from repo root
  try {
    XLSX = require(path.resolve(process.cwd(), "client/node_modules/xlsx"));
  } catch {
    console.error("Error: 'xlsx' package not found. Please run 'npm install xlsx' or run from client directory.");
    process.exit(1);
  }
}

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

const deriveSubPriority = (role = "") => {
  const r = role.toLowerCase().trim();
  if (r.includes("advisor")) return 0;
  if ((r.includes("co") && r.includes("head")) || r === "co-head" || r === "cohead") return 1;
  if (r === "head" || r.endsWith(" head") || r.startsWith("head ") || r.includes(" head")) return 0;
  if (r.includes("lead")) return 2;
  if (r.includes("volunteer")) return 4;
  return 3; // Member
};

const deriveGroup = (role = "", team = "") => {
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

const findFieldValue = (row, candidates) => {
  for (const c of candidates) {
    if (row[c] !== undefined && row[c] !== null && String(row[c]).trim() !== "") {
      return String(row[c]).trim();
    }
  }
  const entries = Object.entries(row);
  for (const c of candidates) {
    const cleanC = c.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const [key, val] of entries) {
      if (val === undefined || val === null || String(val).trim() === "") continue;
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanKey === cleanC) return String(val).trim();
    }
  }
  for (const [key, val] of entries) {
    if (val === undefined || val === null || String(val).trim() === "") continue;
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const c of candidates) {
      const cleanC = c.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanC.length >= 4 && (cleanKey.includes(cleanC) || cleanC.includes(cleanKey))) {
        return String(val).trim();
      }
    }
  }
  return "";
};

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
  console.log(`
Usage:
  node scripts/convert-team-form-excel.js <input-file> [output-file] [default-year]

Arguments:
  input-file     Path to Google Form responses (.xlsx or .csv)
  output-file    Output path for standardized Excel (default: <input-name>_Standardized.xlsx)
  default-year   Tenure year if not specified in rows (default: current year)

Example:
  node scripts/convert-team-form-excel.js responses.xlsx team_2026.xlsx 2026
`);
  process.exit(0);
}

const inputPath = path.resolve(process.cwd(), args[0]);
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

const defaultYear = args[2] ? Number(args[2]) : new Date().getFullYear();
const parsedInput = path.parse(inputPath);
const outputPath = args[1]
  ? path.resolve(process.cwd(), args[1])
  : path.resolve(parsedInput.dir, `${parsedInput.name}_Standardized.xlsx`);

console.log(`Reading input file: ${inputPath}...`);
const workbook = XLSX.readFile(inputPath);
const sheetName = workbook.SheetNames[0];
const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

if (!rawRows || rawRows.length === 0) {
  console.error("Error: Input sheet contains no rows.");
  process.exit(1);
}

console.log(`Found ${rawRows.length} rows in sheet '${sheetName}'. Parsing fields...`);

// Parse rows with fuzzy extraction
const parsedMembers = rawRows.map((row, idx) => {
  const name = findFieldValue(row, ["Name", "Full Name", "Student Name", "Your Name", "fullname", "Member Name"]);
  const rollNo = findFieldValue(row, ["RollNo", "Roll Number", "Roll No", "Roll no.", "Roll", "roll_no", "RollNo."]);
  const yearRaw = findFieldValue(row, ["Year", "Tenure Year", "Year of Tenure", "Batch", "Tenure"]);
  const year = Number(yearRaw) || defaultYear;
  const team = findFieldValue(row, ["Team", "Domain", "Team Name", "Team / Domain", "Department", "Which team are you part of?"]);
  const role = findFieldValue(row, ["Role", "Designation", "Position", "Role in Team", "Role / Position", "Your role in Alumni Cell"]);
  const branch = findFieldValue(row, ["Branch", "Department", "Branch / Department", "Discipline", "Branch / Major"]);
  const image = findFieldValue(row, ["Image_URL", "Upload your photo", "Photo", "Image", "Profile Photo", "Upload photo", "Photograph", "Drive Link", "Drive URL", "Photo URL", "Picture"]);
  const linkedin = findFieldValue(row, ["LinkedIn", "LinkedIn Profile", "LinkedIn URL", "LinkedIn Link", "Linkedin Profile URL"]);
  const insta = findFieldValue(row, ["Instagram", "Instagram Profile", "Instagram URL", "Instagram Handle", "Insta", "Instagram Link"]);
  const contact = findFieldValue(row, ["Contact", "Contact Number", "Phone Number", "Mobile Number", "Phone", "WhatsApp Number", "Mobile"]);
  const whyJoin = findFieldValue(row, ["Why_Join", "Why did you want to join Alumni Cell?", "Why did you join Alumni Cell?", "Why Join", "Why Join Alumni Cell", "Why ACell", "Why Alumni Cell"]);
  const por = findFieldValue(row, ["POR", "Your role / POR in Alumni Cell", "Position of Responsibility", "POR in Alumni Cell", "Past POR", "PORs", "Role / POR"]);
  const hobbies = findFieldValue(row, ["Hobbies", "Hobbies & Interests", "Hobbies and Interests", "Interests", "Hobbies / Interests"]);

  const rawPriority = findFieldValue(row, ["Priority_ID", "priority_id", "Priority", "Priority ID"]);
  const rawSub = findFieldValue(row, ["Sub_Priority", "sub_priority", "Sub Priority", "SubPriority"]);
  const rawGroup = findFieldValue(row, ["Group", "group"]);

  return {
    rowNum: idx + 2,
    rollNo,
    name,
    year,
    team,
    role,
    branch,
    image,
    linkedin,
    insta,
    contact,
    whyJoin,
    por,
    hobbies,
    explicitPriority: rawPriority !== "" && !isNaN(Number(rawPriority)) ? Number(rawPriority) : null,
    explicitSub: rawSub !== "" && !isNaN(Number(rawSub)) ? Number(rawSub) : null,
    explicitGroup: rawGroup !== "" ? rawGroup : null,
  };
});

// Build team priority map
const teamMap = new Map();
for (const st of STANDARD_TEAM_PRIORITIES) {
  for (const k of st.keys) {
    if (!teamMap.has(k)) teamMap.set(k, st.priority);
  }
}

let nextPriority = 10;
for (const m of parsedMembers) {
  const teamKey = (m.team || "").toLowerCase().trim();
  if (!teamKey || teamMap.has(teamKey)) continue;

  let matched = null;
  for (const st of STANDARD_TEAM_PRIORITIES) {
    if (st.keys.some((k) => teamKey.includes(k) || k.includes(teamKey))) {
      matched = st.priority;
      break;
    }
  }

  if (matched !== null) {
    teamMap.set(teamKey, matched);
  } else {
    nextPriority++;
    teamMap.set(teamKey, nextPriority);
  }
}

// Transform into standardized rows
const standardizedRows = parsedMembers.map((m) => {
  const teamKey = (m.team || "").toLowerCase().trim();
  const roleKey = (m.role || "").toLowerCase().trim();

  const priority_id = m.explicitPriority !== null ? m.explicitPriority : (teamMap.get(teamKey) ?? 1);
  const sub_priority = m.explicitSub !== null ? m.explicitSub : deriveSubPriority(roleKey);
  const group = m.explicitGroup !== null ? m.explicitGroup : deriveGroup(m.role, m.team);

  return {
    RollNo: m.rollNo,
    Name: m.name,
    Year: m.year,
    Team: m.team,
    Role: m.role,
    Group: group,
    Priority_ID: priority_id,
    Sub_Priority: sub_priority,
    Branch: m.branch,
    Image_URL: m.image,
    LinkedIn: m.linkedin,
    Instagram: m.insta,
    Contact: m.contact,
    Why_Join: m.whyJoin,
    POR: m.por,
    Hobbies: m.hobbies,
  };
});

// Write output Excel
const outWs = XLSX.utils.json_to_sheet(standardizedRows);
const outWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(outWb, outWs, "Team_Members");
XLSX.writeFile(outWb, outputPath);

console.log(`\n========================================================`);
console.log(`Successfully converted ${standardizedRows.length} members!`);
console.log(`Output saved to: ${outputPath}`);
console.log(`========================================================\n`);

// Print priority summary
const teamSummary = new Map();
for (const row of standardizedRows) {
  if (!teamSummary.has(row.Team)) {
    teamSummary.set(row.Team, { priority: row.Priority_ID, count: 0 });
  }
  teamSummary.get(row.Team).count++;
}

console.log("Assigned Team Priorities:");
Array.from(teamSummary.entries())
  .sort((a, b) => a[1].priority - b[1].priority)
  .forEach(([team, data]) => {
    console.log(`  - Priority ${data.priority}: ${team || "[Empty]"} (${data.count} members)`);
  });
console.log("\nYou can now directly upload this Excel file in the Admin Panel!");
