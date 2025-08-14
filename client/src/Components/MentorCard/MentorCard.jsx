import React from 'react';
import {
  FaEnvelope,
  FaLinkedin,
  FaUser,
  FaGraduationCap,
  FaWrench,
  FaCogs
} from 'react-icons/fa';
import './MentorCard.css';

const MentorCard = ({ mentor }) => {
  return (
    <div className="mentor-card">
      <div className="card-header">
        <img src={mentor.profilePic} alt={mentor.name} className="profile-photo" />
        <h3 className="mentor-name">{mentor.name}</h3>
        <p className="mentor-degree">{mentor.degree}</p>
        <div className="graduation-details">
          <FaGraduationCap className="graduation-cap" />
          <p className="graduation-year">Class of {mentor.graduationYear}</p>
        </div>
      </div>

      <div className="card-content">
        <div className="section">
          <h4 className="section-title">
            <FaUser className="icon" />
            About
          </h4>
          <p className="about-text">{mentor.about}</p>
        </div>

        <div className="section">
          <h4 className="section-title">
            <FaCogs className="icon" />
            Skills</h4>
          <div className="skills-container">
            {mentor.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="icon" />
              <a href={`mailto:${mentor.email}`} className="contact-link">
                {mentor.email}
              </a>
            </div>
            <div className="contact-item">
              <FaLinkedin className="icon" />
              <a
                href={mentor.linkedinId}
                target="_blank"
                rel="noopener n oreferrer"
                className="contact-link"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
