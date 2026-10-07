import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  X,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/alumni";

const formatImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("../")) return url.replace(/^\.\.\//, "/");
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};

const DEFAULT_TEAMS = [
  "Alumni Cell Head",
  "Web Dev",
  "Design",
  "ARAM",
  "Logistics",
  "Newsletter",
  "Content",
];

export default function AdminTeamPanel() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");

  // Single Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData(new Date().getFullYear()));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // Bulk Upload State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkErrors, setBulkErrors] = useState([]);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const bulkFileInputRef = useRef(null);

  // Helper Guide Toggle
  const [showGuide, setShowGuide] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  function showToastMessage(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function getInitialFormData(year) {
    return {
      name: "",
      rollNo: "",
      year: year || new Date().getFullYear(),
      team: "Web Dev",
      role: "",
      group: "Member",
      priority_id: 1,
      sub_priority: 2,
      image: "",
      branch: "",
      linkedin: "",
      insta: "",
      contact: "",
      whyJoin: "",
      por: "",
      hobbies: "",
    };
  }

  // Fetch distinct years
  const fetchYears = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/team/years`);
      if (res.data?.success && res.data.years.length > 0) {
        setYears(res.data.years);
        if (!selectedYear || !res.data.years.includes(selectedYear)) {
          setSelectedYear(res.data.years[0]);
        }
      } else {
        const curYear = new Date().getFullYear();
        setYears([curYear]);
        setSelectedYear(curYear);
      }
    } catch (err) {
      console.error("Error fetching years:", err);
    }
  };

  // Fetch members for selected year
  const fetchMembers = async (yearToFetch) => {
    const yr = yearToFetch || selectedYear;
    if (!yr) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/team?year=${yr}`);
      if (res.data?.success) {
        setMembers(res.data.members || []);
        if (res.data.availableYears?.length > 0) {
          setYears(res.data.availableYears);
        }
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      showToastMessage("Failed to fetch team members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchMembers(selectedYear);
    }
  }, [selectedYear]);

  // Open Add Member Modal
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData(getInitialFormData(selectedYear));
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  // Open Edit Member Modal
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      rollNo: member.rollNo || "",
      year: member.year || selectedYear,
      team: member.team || "Web Dev",
      role: member.role || "",
      group: member.group || "Member",
      priority_id: member.priority_id !== undefined ? member.priority_id : 1,
      sub_priority: member.sub_priority !== undefined ? member.sub_priority : 2,
      image: member.image || "",
      branch: member.branch || "",
      linkedin: member.linkedin || "",
      insta: member.insta || "",
      contact: member.contact || "",
      whyJoin: member.whyJoin || "",
      por: member.por || "",
      hobbies: member.hobbies || "",
    });
    setImageFile(null);
    setImagePreview(member.image || "");
    setIsModalOpen(true);
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "priority_id" || name === "sub_priority" || name === "year"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  // Handle Image File Selection
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save Member (Add or Edit)
  const handleSubmitMember = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.team || !formData.role) {
      alert("Name, Roll Number, Team, and Role are mandatory.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val !== null && val !== undefined ? val : "");
      });

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editingMember) {
        await axios.put(`${API_BASE_URL}/api/team/admin/${editingMember._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToastMessage("Team member updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/team/admin`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToastMessage("Team member added successfully!");
      }

      setIsModalOpen(false);
      fetchYears();
      fetchMembers(formData.year || selectedYear);
    } catch (err) {
      console.error("Error saving member:", err);
      showToastMessage(err.response?.data?.message || "Failed to save member", "error");
    }
  };

  // Delete Member
  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/team/admin/${id}`);
      showToastMessage("Member deleted successfully");
      fetchMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
      showToastMessage("Failed to delete member", "error");
    }
  };

  // Handle Excel/CSV File Upload & Preview
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        if (!json || json.length === 0) {
          alert("The uploaded file contains no rows.");
          return;
        }

        const parsedRows = [];
        const errors = [];

        json.forEach((row, idx) => {
          const rowNum = idx + 2; // header is row 1
          const name = row.Name || row.name;
          const rollNo = row.RollNo || row.rollNo || row.roll_no;
          const year = row.Year || row.year || selectedYear;
          const team = row.Team || row.team;
          const role = row.Role || row.role;

          const isMissing = !name || !rollNo || !team || !role;
          if (isMissing) {
            errors.push(`Row ${rowNum}: Missing mandatory fields`);
          }

          parsedRows.push({
            rollNo: rollNo ? String(rollNo).trim() : "",
            name: name ? String(name).trim() : "",
            year: Number(year) || selectedYear,
            team: team ? String(team).trim() : "",
            role: role ? String(role).trim() : "",
            group: row.Group || row.group || "Member",
            priority_id:
              row.Priority_ID !== undefined
                ? Number(row.Priority_ID)
                : row.priority_id !== undefined
                ? Number(row.priority_id)
                : 1,
            sub_priority:
              row.Sub_Priority !== undefined
                ? Number(row.Sub_Priority)
                : row.sub_priority !== undefined
                ? Number(row.sub_priority)
                : 2,
            branch: row.Branch || row.branch || "",
            image: row.Image_URL || row.image || row.Image || "",
            linkedin: row.LinkedIn || row.linkedin || "",
            insta: row.Instagram || row.insta || "",
            contact: row.Contact || row.contact ? String(row.Contact || row.contact) : "",
            whyJoin: row.Why_Join || row.whyJoin || "",
            por: row.POR || row.por || "",
            hobbies: row.Hobbies || row.hobbies || "",
            isValid: !isMissing,
          });
        });

        setBulkRows(parsedRows);
        setBulkErrors(errors);
        setIsBulkModalOpen(true);
        if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
      } catch (err) {
        console.error("Error reading file:", err);
        alert("Failed to read file. Please ensure it is a valid .xlsx or .csv file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Submit Bulk Upload
  const handleConfirmBulkUpload = async () => {
    const validRows = bulkRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert("No valid rows to upload.");
      return;
    }

    setIsUploadingBulk(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/team/admin/bulk-add`, {
        members: validRows,
      });

      if (res.data?.success) {
        showToastMessage(`Successfully uploaded ${res.data.count} members!`);
        setIsBulkModalOpen(false);
        setBulkRows([]);
        setBulkErrors([]);
        fetchYears();
        fetchMembers();
      }
    } catch (err) {
      console.error("Bulk upload error:", err);
      showToastMessage(err.response?.data?.message || "Failed to upload members", "error");
    } finally {
      setIsUploadingBulk(false);
    }
  };

  // Filtered members list for display
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamFilter === "All" || m.team === teamFilter;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.type === "error" ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-blue-600" size={26} /> Team Management
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage Alumni Cell team members, configure priority ordering, and bulk-import via Excel/CSV.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <HelpCircle size={15} /> {showGuide ? "Hide Priority Guide" : "Priority Guide"}
            </button>

            <a
              href="/Team_Members_Template.xlsx"
              download
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
              title="Download Excel Template"
            >
              <Download size={15} /> Template (.xlsx)
            </a>

            <input
              type="file"
              ref={bulkFileInputRef}
              onChange={handleExcelUpload}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <button
              onClick={() => bulkFileInputRef.current.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg transition-colors"
            >
              <Upload size={15} /> Upload Excel / CSV
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>
        </div>

        {/* Priority Guide Banner */}
        {showGuide && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-blue-950">
              <HelpCircle size={16} /> How Priority & Ordering Works:
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-blue-800">1. Priority ID (Section / Team Order):</p>
                <p className="text-slate-600 mt-0.5">
                  Controls vertical placement of team sections on the public Team page.
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                  <li><strong>0:</strong> Overall Cell Head & Co-Heads (Top)</li>
                  <li><strong>1:</strong> Web Dev / Software Team</li>
                  <li><strong>2:</strong> ARAM Team</li>
                  <li><strong>3:</strong> Design Team</li>
                  <li><strong>4:</strong> Logistics Team, etc.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-800">2. Sub Priority (Role Placement):</p>
                <p className="text-slate-600 mt-0.5">
                  Controls position within each team section.
                </p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                  <li><strong>0:</strong> Team Head (Prominent card grid at top)</li>
                  <li><strong>1:</strong> Team Co-Head</li>
                  <li><strong>2:</strong> Core Members / Developers (Swiper carousel)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Year Filter & Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Year:
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedYear === yr
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {yr}
                </button>
              ))}
              <button
                onClick={() => {
                  const newYr = prompt("Enter new tenure year (e.g., 2027):");
                  if (newYr && !isNaN(newYr)) {
                    const parsed = Number(newYr);
                    if (!years.includes(parsed)) {
                      setYears((prev) => [parsed, ...prev].sort((a, b) => b - a));
                    }
                    setSelectedYear(parsed);
                  }
                }}
                className="px-2 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-dashed border-blue-300"
                title="Add a new year"
              >
                + Year
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search name, roll no, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Teams</option>
              {DEFAULT_TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm">
            Team Members for {selectedYear} ({filteredMembers.length})
          </h3>
          <span className="text-xs text-slate-500">
            Click on any member to edit details or priority
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading team members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p>No team members found for year {selectedYear}.</p>
            <p className="text-xs">Click "Add Member" or "Upload Excel / CSV" to add members.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3">Member</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Team</th>
                  <th className="p-3">Role & Group</th>
                  <th className="p-3">Priority / Sub</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Socials</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {member.image ? (
                          <img
                            src={formatImageUrl(member.image)}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{member.name}</p>
                          {member.contact && (
                            <p className="text-[11px] text-slate-400">{member.contact}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-700">
                      <a
                        href={`/team/${member.rollNo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                        title="View Public Profile"
                      >
                        {member.rollNo}
                        <ExternalLink size={11} />
                      </a>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {member.team}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800">{member.role}</p>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          member.group === "Head"
                            ? "bg-amber-100 text-amber-800"
                            : member.group === "Co-Head"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {member.group}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span
                          className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold"
                          title="Priority ID (Section order)"
                        >
                          P:{member.priority_id}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono"
                          title="Sub Priority (Role order inside team)"
                        >
                          S:{member.sub_priority}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 max-w-[150px] truncate">
                      {member.branch || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-blue-600"
                          >
                            In
                          </a>
                        )}
                        {member.insta && (
                          <a
                            href={member.insta}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-pink-600"
                          >
                            Ig
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Member"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member._id, member.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitMember} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Photo Upload & Preview */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <Users size={24} />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded hover:bg-slate-100 font-medium"
                    >
                      Choose Photo File
                    </button>
                    <span className="text-xs text-slate-400">or enter URL below</span>
                  </div>
                  <input
                    type="text"
                    name="image"
                    placeholder="Image URL (optional if file uploaded)"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full text-xs p-1.5 border border-slate-200 rounded mt-1"
                  />
                </div>
              </div>

              {/* Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Yashasvi Shukla"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    required
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="e.g. 240001002"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tenure Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Team, Role, Group */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Team *
                  </label>
                  <input
                    type="text"
                    name="team"
                    required
                    list="team-options"
                    value={formData.team}
                    onChange={handleChange}
                    placeholder="e.g. Web Dev"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="team-options">
                    {DEFAULT_TEAMS.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Head, Team Lead"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Group Classification
                  </label>
                  <select
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Head">Head</option>
                    <option value="Co-Head">Co-Head</option>
                    <option value="Member">Member</option>
                    <option value="Advisor">Advisor</option>
                  </select>
                </div>
              </div>

              {/* Priority & Sub Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority ID (Section Order)
                  </label>
                  <input
                    type="number"
                    name="priority_id"
                    value={formData.priority_id}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    0 = Overall Heads, 1 = Web Dev, 2 = ARAM, 3 = Design...
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub Priority (Position in Team)
                  </label>
                  <input
                    type="number"
                    name="sub_priority"
                    value={formData.sub_priority}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    0 = Team Head, 1 = Co-Head, 2 = Core Member
                  </p>
                </div>
              </div>

              {/* Branch, Contact, Socials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch / Department
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    name="insta"
                    value={formData.insta}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Profile Details (Why Join, POR, Hobbies) */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Why they wanted to join Alumni Cell?
                  </label>
                  <textarea
                    rows={2}
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleChange}
                    placeholder="Describe motivation to join Alumni Cell..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Positions of Responsibility (POR)
                  </label>
                  <input
                    type="text"
                    name="por"
                    value={formData.por}
                    onChange={handleChange}
                    placeholder="e.g. Web Dev Head (2025-26), Core Member"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hobbies & Interests
                  </label>
                  <input
                    type="text"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleChange}
                    placeholder="e.g. Open Source, Football, Photography"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  {editingMember ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Preview Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-emerald-600" size={22} />
                <h3 className="text-lg font-bold text-slate-800">
                  Bulk Upload Preview ({bulkRows.length} Rows)
                </h3>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {bulkErrors.length > 0 && (
              <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs shrink-0 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>
                  {bulkErrors.length} rows have missing mandatory fields and will be skipped.
                </span>
              </div>
            )}

            <div className="p-6 overflow-y-auto grow">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <th className="p-2">Status</th>
                    <th className="p-2">Roll No</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Year</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2">Sub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bulkRows.map((r, i) => (
                    <tr
                      key={i}
                      className={r.isValid ? "hover:bg-slate-50" : "bg-red-50 text-red-700"}
                    >
                      <td className="p-2 font-semibold">
                        {r.isValid ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle size={14} /> Valid
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> Incomplete
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-mono">{r.rollNo || "-"}</td>
                      <td className="p-2 font-bold">{r.name || "-"}</td>
                      <td className="p-2">{r.year}</td>
                      <td className="p-2">{r.team}</td>
                      <td className="p-2">{r.role}</td>
                      <td className="p-2 font-mono">P:{r.priority_id}</td>
                      <td className="p-2 font-mono">S:{r.sub_priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <p className="text-xs text-slate-500">
                Ready to insert{" "}
                <span className="font-bold text-slate-800">
                  {bulkRows.filter((r) => r.isValid).length}
                </span>{" "}
                valid members.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkUpload}
                  disabled={isUploadingBulk || bulkRows.filter((r) => r.isValid).length === 0}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-50"
                >
                  {isUploadingBulk ? "Uploading..." : "Confirm & Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
