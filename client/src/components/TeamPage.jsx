// pages/TeamPage.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamMembers } from "../lib/teamdata";
import Comp from "../Components/TeamComponent/Comp";

gsap.registerPlugin(ScrollTrigger);

export default function TeamPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

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
        start: "top 85%",
        once: true,
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  //Group by team 
  const teams = teamMembers.reduce((acc, member) => {
    if (!acc[member.team]) acc[member.team] = [];
    acc[member.team].push(member);
    return acc;
  }, {});

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#F8F8F8] to-[#FFFFFF]"
    >
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%239C92AC fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=4/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-6xl lg:text-7xl font-extrabold text-blue-300  bg-clip-text ">
              Our Team
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Meet the passionate individuals driving our alumni community
              forward. Together, we’re building bridges between past, present,
              and future.
            </p>
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="container mx-auto px-6 pb-24 space-y-20">
        {Object.keys(teams).map((team) => (
          <div key={team}>
            <Comp title={team} members={teams[team]} />
            <div className="border-t border-gray-200 my-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
