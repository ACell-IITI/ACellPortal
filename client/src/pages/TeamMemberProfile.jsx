import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaPhone } from "react-icons/fa";
import { API_BASE_URL } from "../api/alumni";
import { teamMembers as fallbackTeamMembers } from "../lib/teamdata";

const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/200";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  )
    return url;
  if (url.startsWith("../")) return url.replace(/^\.\.\//, "/");
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};

export default function TeamMemberProfile() {
  const { rollNo } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [allTenures, setAllTenures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [rollNo]);

  useEffect(() => {
    async function fetchProfile() {
      if (!rollNo) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/team/member/${rollNo}`,
        );
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
      const found = fallbackTeamMembers.find(
        (m) =>
          String(m.rollNo) === String(rollNo) ||
          String(m.id) === String(rollNo),
      );
      if (found) {
        setMember({
          ...found,
          year: 2025,
          branch: found.branch || "Indian Institute of Technology Indore",
          whyJoin:
            found.whyJoin ||
            "I wanted to contribute to strengthening the connection between students and the alumni network, learning from industry leaders and giving back to the IIT Indore community.",
          por: found.por || "",
          hobbies: found.hobbies || "Reading, Technology, Networking",
        });
        setAllTenures([found]);
      } else {
        setError("Member not found");
      }
    }

    fetchProfile();
  }, [rollNo]);

  // Formatter for POR display
  const getFormattedPOR = (m) => {
    if (m.por && m.por.trim() !== "") {
      return m.por;
    }
    const team = m.team || "Web Dev";
    let role = m.role || "Member";
    if (role.toLowerCase() === "member") {
      role = "Team Member";
    }
    return `${team} ${role} - Alumni Cell`;
  };

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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 pt-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Profile Not Found
        </h2>
        <p className="text-slate-500 max-w-md mb-6">
          We couldn't find a team member profile matching roll number "{rollNo}
          ".
        </p>
        <button
          type="button"
          onClick={() => navigate("/team")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#153462] text-white rounded-xl font-bold shadow hover:bg-blue-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to Team
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Banner with Website Navy Style */}
      <div className="bg-[#153462] text-white pt-10 pb-28 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {/* Bold Back to Team Button */}
          <button
            type="button"
            onClick={() => navigate("/team")}
            className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition-colors text-base font-bold mb-6 cursor-pointer group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Team</span>
          </button>

          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {member.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Avatar & Contact Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              {/* Photo Container with Proper Fit to Prevent Cropping */}
              <div className="w-full max-w-[260px] h-64 sm:h-72 mx-auto rounded-2xl overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={formatImageUrl(member.image)}
                  alt={member.name}
                  className="w-full h-full object-contain rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {member.name}
              </h2>
              <p className="text-sm font-semibold text-[#153462] mt-1">
                {member.role} &bull; {member.team}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 text-left text-sm text-slate-700">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-slate-500 w-20 shrink-0">
                    Roll No:
                  </span>
                  <span className="font-mono font-bold text-black">
                    {member.rollNo || rollNo}
                  </span>
                </div>
                {member.branch && (
                  <div className="flex items-start gap-2.5">
                    <span className="font-semibold text-slate-500 w-20 shrink-0">
                      Branch:
                    </span>
                    <span className="text-black font-medium">
                      {member.branch}
                    </span>
                  </div>
                )}
                {(member.contact || member.Contact) && (
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-slate-500 w-20 shrink-0">
                      Contact:
                    </span>
                    <a
                      href={`tel:${member.contact || member.Contact}`}
                      className="text-black hover:underline font-medium"
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
                    <FaLinkedinIn size={18} />
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
                    <FaInstagram size={18} />
                  </a>
                )}
                {(member.contact || member.Contact) && (
                  <a
                    href={`tel:${member.contact || member.Contact}`}
                    className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                    aria-label="Call"
                  >
                    <FaPhone size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: ALL 3 SECTIONS MERGED IN ONE SINGLE CARD */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
              {/* Section 1: Why I Joined Alumni Cell with Big Designer Quotation Marks */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-3">
                  Why I Joined Alumni Cell
                </h3>
                <div className="py-2">
                  <p className="text-slate-700 text-base sm:text-lg italic leading-relaxed">
                    <span className="text-5xl sm:text-6xl font-serif text-black select-none leading-none relative top-3 mr-1">
                      &ldquo;
                    </span>
                    {member.whyJoin ||
                      "I wanted to contribute to strengthening the connection between students and the alumni network, learning from industry leaders and giving back to the IIT Indore community."}
                    <span className="text-5xl sm:text-6xl font-serif text-black select-none leading-none relative top-3 ml-1">
                      &rdquo;
                    </span>
                  </p>
                </div>
              </div>

              {/* Section 2: Position of Responsibility */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                  Positions of Responsibility (POR)
                </h3>
                <p className="text-slate-800 text-base font-semibold leading-relaxed">
                  {getFormattedPOR(member)}
                </p>
              </div>

              {/* Section 3: Hobbies & Interests as Normal Text */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                  Hobbies & Interests
                </h3>
                <p className="text-slate-700 text-base leading-relaxed">
                  {member.hobbies || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
