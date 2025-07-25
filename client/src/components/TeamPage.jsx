import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamMembers } from "../lib/teamdata";

gsap.registerPlugin(ScrollTrigger);

export default function Team() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const teamGridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
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

      // Use ScrollTrigger.batch for better performance
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

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%239C92AC fill-opacity=0.05%3E%3Ccircle cx=30 cy=30 r=4/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"
        ></div>

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
              Our Team
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Meet the passionate individuals driving our alumni community
              forward. Together, we're building bridges between past, present,
              and future.
            </p>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div ref={teamGridRef} className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="team-card group relative will-change-transform will-change-opacity opacity-0 translate-y-10 scale-95 transition-transform duration-700 ease-in-out"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:shadow-xl transform hover:scale-[1.02] shine">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Avatar */}
                <div className="relative z-10 mb-6">
                  <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden ring-4 ring-purple-400/30 group-hover:ring-purple-400/60 transition-all duration-500">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Role badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-purple-300 font-semibold mb-1">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">{member.year}</p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.bio}
                  </p>

                  {/* Social links */}
                  <div className="flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <a
                      href={member.linkedin}
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-900 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.258.82-.577v-2.234c-3.338.724-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.776.418-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.933 0-1.312.468-2.383 1.236-3.222-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.222 0 4.61-2.807 5.63-5.48 5.922.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 shine-effect transition-transform duration-[1500ms] ease-in-out -translate-x-full group-hover:translate-x-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-6 pb-24">
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.1%3E%3Cpath d=M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Want to Join Our Team?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                We're always looking for passionate alumni to help strengthen
                our community.
              </p>
              <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-2xl hover:bg-purple-50 transition duration-300 transform hover:scale-105 shadow-xl">
                Get Involved
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shine effect styles */}
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
