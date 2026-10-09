// pages/TeamPage.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Comp from "../Components/TeamComponent/Comp";
import { API_BASE_URL } from "../api/alumni";
import { ChevronDown, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function TeamPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Available Years & Members
  useEffect(() => {
    async function loadInitialData() {
      try {
        const yearsRes = await axios.get(`${API_BASE_URL}/api/team/years`);
        if (yearsRes.data?.success && yearsRes.data.years.length > 0) {
          const yrs = yearsRes.data.years;
          setAvailableYears(yrs);
          setSelectedYear(yrs[0]);
        } else {
          const curYear = new Date().getFullYear();
          setAvailableYears([curYear]);
          setSelectedYear(curYear);
        }
      } catch (err) {
        console.error("Error fetching years, falling back:", err);
        const curYear = new Date().getFullYear();
        setAvailableYears([curYear]);
        setSelectedYear(curYear);
      }
    }
    loadInitialData();
  }, []);

  // Fetch Members when selectedYear changes
  useEffect(() => {
    async function fetchTeamData() {
      if (!selectedYear) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/team?year=${encodeURIComponent(selectedYear)}`
        );
        if (res.data?.success) {
          setMembers(res.data.members || []);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error("Error fetching team data from API:", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamData();
  }, [selectedYear]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.children,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
        }
      );

      ScrollTrigger.batch(".team-card", {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
          }),
        start: "top 10%",
        once: true,
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [members]);

  // Group members by team, and sort teams by their lowest priority_id
  const teamGroups = members.reduce((acc, member) => {
    const teamName = member.team || "Team";
    if (!acc[teamName]) {
      acc[teamName] = {
        name: teamName,
        priority: member.priority_id !== undefined ? member.priority_id : 99,
        members: [],
      };
    }
    // Update team priority if a member has lower priority_id
    if (
      member.priority_id !== undefined &&
      member.priority_id < acc[teamName].priority
    ) {
      acc[teamName].priority = member.priority_id;
    }
    acc[teamName].members.push(member);
    return acc;
  }, {});

  // Sort teams ascending by priority
  const sortedTeams = Object.values(teamGroups).sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#F8F8F8] to-[#FFFFFF]"
    >
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%239C92AC fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=4/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative container mx-auto px-6 pt-24 pb-12 lg:pt-32 lg:pb-16">
          <div className="text-center space-y-6">
            <h1 className="text-6xl lg:text-7xl font-extrabold text-blue-300 bg-clip-text">
              Our Team
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Meet the passionate individuals driving our alumni community
              forward. Together, we’re building bridges between past, present,
              and future.
            </p>
          </div>

          {/* Year Switcher Pills & Dropdown */}
          <div className="mt-12 flex items-center justify-center flex-wrap gap-3">
            <div className="inline-flex items-center p-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200">
              {availableYears.slice(0, 4).map((yr) => {
                const isActive = String(selectedYear) === String(yr);
                const label = String(yr).match(/^\d{4}$/) ? `TEAM ${yr}` : String(yr);
                return (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
                      isActive
                        ? "bg-[#153462] text-white shadow-md transform scale-105"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              {/* Dropdown for older/additional years */}
              {availableYears.length > 4 && (
                <div className="relative inline-block ml-1">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer focus:outline-none"
                  >
                    <option disabled value="">More Editions</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {String(yr).match(/^\d{4}$/) ? `Team ${yr}` : yr}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-3 pointer-events-none text-slate-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teams Render */}
      <div className="container mx-auto px-6 pb-24 space-y-20 w-100vw">
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading Team {selectedYear}...</p>
          </div>
        ) : sortedTeams.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No members found for Team {selectedYear}.</p>
          </div>
        ) : (
          sortedTeams.map((teamGroup) => (
            <div key={teamGroup.name}>
              <Comp title={teamGroup.name} members={teamGroup.members} />
              <div className="border-t border-gray-200 my-10"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
