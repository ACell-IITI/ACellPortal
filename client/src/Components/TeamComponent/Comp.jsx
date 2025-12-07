"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import "./Comp.css";

export default function TeamComponent({ title, members }) {
  const heads = members.filter((m) => m.group === "Head");
  const others = members.filter((m) => m.group !== "Head");

  return (
    <div className="mb-20 relative px-4 sm:px-6 lg:px-12">
      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight mb-10 sm:mb-16 text-center relative">
        {title}
        <span className="block w-20 sm:w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto mt-3 rounded-full"></span>
      </h2>

      <div className="flex flex-col items-center">
        {/* Fixed Head Members */}
        <div className="flex justify-center flex-wrap gap-6 mb-10 sm:mb-12">
          {heads.map((member) => (
            <div
              key={member.id}
              className="relative bg-white rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]
                         transition-all duration-500 hover:shadow-2xl hover:scale-[1.05] overflow-hidden
                         h-[380px] sm:h-[400px] flex flex-col justify-between w-[240px] sm:w-[260px] md:w-[280px]"
            >
              {/* Profile Image */}
              <div className="relative z-10 mb-4 sm:mb-6">
                <div className="w-28 sm:w-32 h-28 sm:h-32 mx-auto rounded-full overflow-hidden border-[4px] border-yellow-400 shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="relative z-10 text-center flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-600 font-semibold text-sm sm:text-base">{member.role}</p>

                {/* Socials */}
                <div className="mt-auto flex justify-center space-x-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {member.insta && (
                    <a
                      href={member.insta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-300 via-pink-600 to-purple-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel for Others */}
        <Swiper
          slidesPerView={1.1}
          spaceBetween={20}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          modules={[Navigation, Autoplay]}
          className="px-2 sm:px-4 w-full"
        >
          {others.map((member) => (
            <SwiperSlide key={member.id}>
              <div
                className={`relative bg-white rounded-3xl p-6 sm:p-8 border shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.05] group overflow-hidden
                  ${
                    member.group === "Co-Head"
                      ? "border-4 border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.5)]"
                      : "border border-gray-100"
                  }
                  h-[360px] sm:h-[400px] flex flex-col justify-between mt-4 mb-6`}
              >
                {/* Profile Image */}
                <div className="relative z-10 mb-4 sm:mb-6">
                  <div
                    className={`w-28 sm:w-32 h-28 sm:h-32 mx-auto rounded-full overflow-hidden border-[4px] shadow-xl ${
                      member.group === "Co-Head"
                        ? "border-orange-400"
                        : "border-indigo-400"
                    }`}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="relative z-10 text-center flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-semibold text-sm sm:text-base">{member.role}</p>

                  {/* Socials */}
                  <div className="mt-auto flex justify-center space-x-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                      >
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    )}
                    {member.insta && (
                      <a
                        href={member.insta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-300 via-pink-600 to-purple-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
