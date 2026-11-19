"use client";

import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import "./Comp.css";

const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/150";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("../")) return url.replace(/^\.\.\//, "/");
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};

export default function TeamComponent({ title, members = [] }) {
  const navigate = useNavigate();

  const handleCardClick = (member) => {
    if (member.rollNo && String(member.rollNo).trim() !== "") {
      navigate(`/team/${member.rollNo}`);
    } else if (member._id) {
      navigate(`/team/${member._id}`);
    } else if (member.id) {
      navigate(`/team/${member.id}`);
    }
  };

  // Heads are members classified as Head, or with sub_priority 0
  const heads = members.filter(
    (m) => m.group === "Head" || (m.sub_priority !== undefined && m.sub_priority === 0)
  );
  // Others are non-heads
  const others = members.filter(
    (m) => m.group !== "Head" && (m.sub_priority === undefined || m.sub_priority > 0)
  );

  // If there are 4 or fewer members in `others`, display them in a dynamic centered grid.
  // Use carousel only when there are more than 4 members.
  const isSlider = others.length > 4;

  const renderCard = (member, isHead = false) => (
    <div
      key={member._id || member.id || member.rollNo}
      onClick={() => handleCardClick(member)}
      className={`team-card cursor-pointer group hover:shadow-xl transition-all ${
        isHead
          ? "team-card-head"
          : member.group === "Co-Head"
          ? "team-card-cohead"
          : "team-card-member"
      }`}
      title={`View ${member.name}'s Profile`}
    >
      <div className="team-card-bg"></div>

      <div className="team-avatar-wrapper">
        <div
          className={`team-avatar ${
            isHead
              ? "team-avatar-head"
              : member.group === "Co-Head"
              ? "team-avatar-cohead"
              : "team-avatar-member"
          }`}
        >
          <img
            src={formatImageUrl(member.image)}
            alt={member.name}
            className="team-avatar-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>
      </div>

      <div className="team-info">
        <h3 className="team-name group-hover:text-blue-600 transition-colors">
          {member.name}
        </h3>
        <p className="team-role">{member.role}</p>
        {(member.contact || member.Contact) && (
          <p className="team-contact">
            <span>Contact:</span> {member.contact || member.Contact}
          </p>
        )}
        {member.branch && (
          <p className="text-xs text-slate-500 mt-1 truncate">
            {member.branch}
          </p>
        )}

        {(member.linkedin || member.insta) && (
          <div className="team-socials">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="team-social-link team-social-linkedin"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={isHead ? 16 : 14} />
              </a>
            )}
            {member.insta && (
              <a
                href={member.insta}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="team-social-link team-social-instagram"
                aria-label="Instagram"
              >
                <FaInstagram size={isHead ? 16 : 14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="team-section">
      <h2 className="team-title">
        {title}
        <span className="team-title-underline"></span>
      </h2>

      <div className="team-container">
        {heads.length > 0 && (
          <div className="team-heads-grid">
            {heads.map((member) => renderCard(member, true))}
          </div>
        )}

        {others.length > 0 && (
          isSlider ? (
            <Swiper
              slidesPerView={1.1}
              spaceBetween={20}
              centerInsufficientSlides={true}
              watchOverflow={true}
              navigation={true}
              autoplay={{
                delay: 2800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
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
                <SwiperSlide key={member._id || member.id || member.rollNo}>
                  {renderCard(member, false)}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="team-others-grid">
              {others.map((member) => renderCard(member, false))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
