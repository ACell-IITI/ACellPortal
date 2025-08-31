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
                
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden ring-4 ring-[#4FA095]/30 group-hover:ring-[#4FA095]/60 transition-all duration-500">
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
                <p className="text-[#BAD1C2] font-semibold mb-4">
                  {member.role}
                </p>

                <div className="flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      className="w-10 h-10 bg-[#153462] rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
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
                  {member.insta && (
                    <a
                      href={member.insta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-tr from-yellow-300 via-pink-500 to-purple-400 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
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
