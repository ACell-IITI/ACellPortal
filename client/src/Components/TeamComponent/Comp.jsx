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
    <div className="team-section">
      <h2 className="team-title">
        {title}
        <span className="team-title-underline"></span>
      </h2>

      <div className="team-container">
        <div className="team-heads-grid">
          {heads.map((member) => (
            <div key={member.id} className="team-card team-card-head">
              <div className="team-card-bg"></div>

              <div className="team-avatar-wrapper">
                <div className="team-avatar team-avatar-head">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-avatar-img"
                  />
                </div>
              </div>

              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                {member.Contact && (
                  <p className="team-contact">
                    <span>Contact:</span> {member.Contact}
                  </p>
                )}

                <div className="team-socials">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-link team-social-linkedin"
                      aria-label="LinkedIn"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {member.insta && (
                    <a
                      href={member.insta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-link team-social-instagram"
                      aria-label="Instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

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
            480: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          modules={[Navigation, Autoplay]}
          className="team-swiper"
        >
          {others.map((member) => (
            <SwiperSlide key={member.id}>
              <div
                className={`team-card ${
                  member.group === "Co-Head"
                    ? "team-card-cohead"
                    : "team-card-member"
                }`}
              >
                <div className="team-card-bg"></div>

                <div className="team-avatar-wrapper">
                  <div
                    className={`team-avatar ${
                      member.group === "Co-Head"
                        ? "team-avatar-cohead"
                        : "team-avatar-member"
                    }`}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-avatar-img"
                    />
                  </div>
                </div>

                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
