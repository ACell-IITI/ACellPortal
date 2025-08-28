"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

export default function TeamComponent({ title, members }) {
  return (
    <div className="mb-20 relative">
      {/* Section Title */}
      <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight mb-16 text-center relative">
        {title}
        <span className="block w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto mt-3 rounded-full"></span>
      </h2>

      {/* Carousel */}
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{
          delay: 2800,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        modules={[Navigation, Autoplay]}
        className="px-6"
      >
        {members.map((member) => (
          <SwiperSlide key={member.id}>
            <div
              className={`relative bg-white rounded-3xl p-8 border shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.05] group overflow-hidden
                ${member.group === "Head" 
                  ? "border-4 border-yellow-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]" 
                  : member.group === "Co-Head" 
                    ? "border-4 border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.5)]"
                    : "border border-gray-100"
                } h-[400px] flex flex-col justify-between mt-6 mb-6`}
            >
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-teal-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

              {/* Profile Image */}
              <div className="relative z-10 mb-6">
                <div
                  className={`w-32 h-32 mx-auto rounded-full overflow-hidden border-[4px] shadow-xl
                    ${member.group === "Head" 
                      ? "border-yellow-400" 
                      : member.group === "Co-Head" 
                        ? "border-orange-400" 
                        : "border-indigo-400"}`}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Text Info */}
              <div className="relative z-10 text-center flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-600 font-semibold">{member.role}</p>
                {/* <p className="text-sm text-gray-500 mb-3">{member.year}</p> */}
                {/* <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {member.bio}
                </p> */}

                {/* Social Links (stick to bottom if content is small) */}
                <div className="mt-auto flex justify-center space-x-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                    >
                      <i className="fab fa-github"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
