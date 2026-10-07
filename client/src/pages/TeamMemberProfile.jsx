import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Award,
  BookOpen,
  Heart,
  Calendar,
  Briefcase,
  GraduationCap,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { API_BASE_URL } from "../api/alumni";
import { teamMembers as fallbackTeamMembers } from "../lib/teamdata";

const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/200";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("../")) return url.replace(/^\.\.\//, "/");
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};

export default function TeamMemberProfile() {
  const { rollNo } = useParams();
  const [member, setMember] = useState(null);
  const [allTenures, setAllTenures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!rollNo) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/team/member/${rollNo}`);
        if (res.data?.success && res.data.member) {
          setMember(res.data.member);
          setAllTenures(res.data.allTenures || [res.data.member]);
        } else {
          tryFallback();
        }
      } catch (err) {
        console.warn("API profile fetch failed, checking fallback data:", err);
        tryFallback();
      } finally {
        setLoading(false);
      }
    }

    function tryFallback() {
      // Find in fallback hardcoded data by rollNo or by id
      const found = fallbackTeamMembers.find(
        (m) =>
          String(m.rollNo) === String(rollNo) ||
          String(m.id) === String(rollNo)
      );
      if (found) {
        setMember({
          ...found,
          year: 2025,
          branch: found.branch || "Indian Institute of Technology Indore",
          whyJoin:
            found.whyJoin ||
            "Passionate about fostering long-term bonds between our esteemed alumni and current student body.",
          por: found.por || `${found.role} - Alumni Cell`,
          hobbies: found.hobbies || "Technology, Networking, Reading",
        });
        setAllTenures([found]);
      } else {
        setError("Member not found");
      }
    }

    fetchProfile();
  }, [rollNo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#153462] mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 pt-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
        <p className="text-slate-500 max-w-md mb-6">
          We couldn't find a team member profile matching roll number "{rollNo}".
        </p>
        <Link
          to="/team"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#153462] text-white rounded-xl font-semibold shadow hover:bg-blue-900 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Team Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Banner & Back Link */}
      <div className="bg-[#153462] text-white pt-10 pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-semibold mb-6"
          >
            <ArrowLeft size={16} /> Back to Team
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-200 mb-2">
                Team Member Profile
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {member.name}
              </h1>
            </div>
            {member.year && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 text-sm font-bold">
                <Calendar size={16} /> Tenure {member.year}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Avatar & Contact Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center overflow-hidden">
              <div className="relative inline-block mx-auto mb-4">
                <img
                  src={formatImageUrl(member.image)}
                  alt={member.name}
                  className="w-40 h-40 rounded-2xl object-cover mx-auto shadow-md border-4 border-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
                <span className="absolute bottom-2 right-2 p-1.5 bg-[#153462] text-white rounded-lg shadow">
                  <UserCheck size={16} />
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-800">{member.name}</h2>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {member.role} &bull; {member.team}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-left text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-slate-400 w-20">Roll No:</span>
                  <span className="font-mono font-bold text-slate-800">{member.rollNo || rollNo}</span>
                </div>
                {member.branch && (
                  <div className="flex items-start gap-2.5">
                    <span className="font-semibold text-slate-400 w-20 shrink-0">Branch:</span>
                    <span className="text-slate-700 font-medium">{member.branch}</span>
                  </div>
                )}
                {(member.contact || member.Contact) && (
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-slate-400 w-20">Contact:</span>
                    <a
                      href={`tel:${member.contact || member.Contact}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {member.contact || member.Contact}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-3">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {member.insta && (
                  <a
                    href={member.insta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white rounded-xl transition-all shadow-sm"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {(member.contact || member.Contact) && (
                  <a
                    href={`tel:${member.contact || member.Contact}`}
                    className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                    aria-label="Call"
                  >
                    <Phone size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Past Tenures History (if part of cell in multiple years) */}
            {allTenures.length > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar size={14} /> Tenure History
                </h3>
                <div className="space-y-2">
                  {allTenures.map((t) => (
                    <div
                      key={t._id || t.year}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{t.role}</p>
                        <p className="text-slate-500">{t.team}</p>
                      </div>
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {t.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Sections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Why Join Alumni Cell */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Heart className="text-rose-500" size={20} /> Why I Joined Alumni Cell
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100 italic">
                "{member.whyJoin ||
                  "I wanted to contribute to strengthening the connection between students and the alumni network, learning from industry leaders and giving back to the IIT Indore community."}"
              </p>
            </div>

            {/* Position of Responsibility (POR) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Award className="text-amber-500" size={20} /> Positions of Responsibility (POR)
              </h3>
              {member.por ? (
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  {member.por}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  {member.role} &bull; {member.team} (Tenure {member.year || 2026})
                </p>
              )}
            </div>

            {/* Hobbies & Interests */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <BookOpen className="text-blue-500" size={20} /> Hobbies & Interests
              </h3>
              {member.hobbies ? (
                <div className="flex flex-wrap gap-2">
                  {member.hobbies
                    .split(",")
                    .map((hobby, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
                      >
                        {hobby.trim()}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No hobbies listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
