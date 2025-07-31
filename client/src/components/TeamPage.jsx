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
        heroRef.current?.children[0],
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        heroRef.current?.children[1],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
      );

      ScrollTrigger.batch(".team-card", {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          }),
        start: "top 80%",
        once: true,
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const heads = teamMembers.filter((m) => m.group === "Head");
  const coHeads = teamMembers.filter((m) => m.group === "Co-Head");
  const members = teamMembers.filter((m) => m.group === "Member");

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#153462] via-[#4FA095] to-[#153462]"
    >
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%239C92AC fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=4/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-[#F6F6C9] via-[#BAD1C2] to-[#4FA095] bg-clip-text text-transparent mb-6">
              Our Team
            </h1>
            <p className="text-xl lg:text-2xl text-[#F6F6C9] max-w-3xl mx-auto leading-relaxed">
              Meet the passionate individuals driving our alumni community
              forward. Together, we're building bridges between past, present,
              and future.
            </p>
          </div>
        </div>
      </div>

      {/* Team Sections */}
      <div className="container mx-auto px-6 pb-24">
        <Comp title="Heads" members={heads} />
        <Comp title="Co-Heads" members={coHeads} />
        <Comp title="Team Members" members={members} />
      </div>

      <style jsx>{`
        .shine-effect {
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
