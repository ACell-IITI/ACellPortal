
export default function TeamComponent({ title, members }) {
  return (
    <div className="mb-20">
      {/* Section Title */}
      <h2 className="text-3xl lg:text-4xl font-bold text-[#F6F6C9] mb-10 text-center">
        {title}
      </h2>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((member) => (
          <div
            key={member.id}
            className="team-card group relative will-change-transform will-change-opacity opacity-0 translate-y-10 scale-95 transition-transform duration-700 ease-in-out"
          >
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-[#4FA095]/50 transition-all duration-500 hover:shadow-xl transform hover:scale-[1.02] shine">
              <div className="absolute inset-0 bg-gradient-to-br from-[#BAD1C2]/20 to-[#4FA095]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 mb-6">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden ring-4 ring-[#4FA095]/30 group-hover:ring-[#4FA095]/60 transition-all duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#F6F6C9] transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-[#BAD1C2] font-semibold mb-1">
                  {member.role}
                </p>
                <p className="text-sm text-gray-700 mb-4">{member.year}</p>
                <p className="text-sm text-gray-300 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {member.bio}
                </p>

                <div className="flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      className="w-10 h-10 bg-[#153462] rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {member.github && (
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
                  )}
                </div>
              </div>

              <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
                <div className="absolute inset-0 shine-effect transition-transform duration-[1500ms] ease-in-out -translate-x-full group-hover:translate-x-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
