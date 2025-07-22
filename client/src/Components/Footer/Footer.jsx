import React from "react";
import "./Footer.css";

const logoUrl = "/Media/logo.png";

const socialIcons = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/alumnicell-iiti/",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#0077b5">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.042 0 3.604 2.003 3.604 4.606v5.59z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/alumni_cell_iiti/",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17" cy="7" r="1.5" fill="#E4405F" stroke="none" />
      </svg>
    ),
  },
  {
    name: "X",
    url: "https://x.com/",
    svg: (
      <svg width="24" height="24" viewBox="0 0 120 120" fill="none">
        <rect width="120" height="120" rx="24" fill="#000" />
        <path d="M85.5 34.5H74.6L60 54.1L45.4 34.5H34.5L54.3 60L34.5 85.5H45.4L60 65.9L74.6 85.5H85.5L65.7 60L85.5 34.5Z" fill="#fff"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/iitialumnicell/",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877f3">
        <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.125v-3.622h3.125v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.733 0 1.325-.593 1.325-1.326v-21.349c0-.734-.592-1.326-1.325-1.326z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@AlumniCorporateRelationsIITInd",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff0000">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.12 3.5 12 3.5 12 3.5s-7.12 0-9.391.566a2.994 2.994 0 0 0-2.107 2.12A31.834 31.834 0 0 0 0 12a31.834 31.834 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.12C4.88 20.5 12 20.5 12 20.5s7.12 0 9.391-.566a2.994 2.994 0 0 0 2.107-2.12A31.834 31.834 0 0 0 24 12a31.834 31.834 0 0 0-.502-5.814zM9.545 16.02V7.98l7.273 4.02-7.273 4.02z"/>
      </svg>
    ),
  },
];

const Footer = () => (
<>
  <footer className="footer">
    <div className="footer2"></div>
    <div className="footer1"><div className="footer-content">
      <div className="footer-section logo-section">
        <img src={logoUrl} alt="IIT Indore Logo" />
        <div>
          <strong>
            ACR Office, 7th floor, Abhinandan Bhavan,<br />
            Indian Institute of Technology Indore,
          </strong>
          <br />
          Khandwa Road, Simrol, Indore - 453552<br />
          India.
        </div>
      </div>

      <div className="footer-section quick-links">
        <div className="section-title">Quick Links</div>
          <div>
      <div><a href="https://www.iiti.ac.in" target="_blank" rel="noopener noreferrer">IITI Website</a></div>
      <div><a href="https://www.iiti.ac.in/international-relations" target="_blank" rel="noopener noreferrer">International Relations</a></div>
      <div><a href="https://www.iiti.ac.in/academics" target="_blank" rel="noopener noreferrer">Academics</a></div>
      <div><a href="https://www.iiti.ac.in/office" target="_blank" rel="noopener noreferrer">Office</a></div>
    </div>
      </div>

      <div className="footer-section social-media">
        <div className="section-title">Find Us On</div>
        <div className="social-icons">
          {socialIcons.map((icon) => (
            <a
              key={icon.name}
              href={icon.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={icon.name}
            >
              {icon.svg}
            </a>
          ))}
        </div>
      </div>
    </div></div>
    
  </footer>
  <div className="rights">© 2025 - All Rights with IIT Indore</div>
  </>
);

export default Footer;
