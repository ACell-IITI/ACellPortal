import React from "react";
import "./Footer.css";

const logoUrl = "/Media/iitilogo.webp";

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
  {
    name: "Whatsapp",
    url:  "https://wa.me/917470842408",
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
        <path d="M20.52 3.48A11.815 11.815 0 0 0 12.06.002C6.507.002 2 4.51 2 10.06c0 1.77.464 3.497 1.344 5.01L.002 23.998l8.23-2.16a11.92 11.92 0 0 0 3.83.63h.004c5.553 0 10.06-4.508 10.06-10.06 0-2.69-1.05-5.233-2.844-7.298zM12.06 18.18c-1.23 0-2.43-.33-3.48-.95l-.25-.15-4.88 1.28 1.3-4.75-.16-.26a7.94 7.94 0 0 1-1.2-4.22c0-4.4 3.58-7.98 7.98-7.98 2.13 0 4.14.83 5.65 2.34a7.92 7.92 0 0 1 2.33 5.64c0 4.4-3.58 7.98-7.98 7.98zm4.33-5.92c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.37.1-.49.1-.1.24-.26.36-.39.12-.12.16-.2.24-.34.08-.14.04-.26-.02-.38-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42h-.46c-.16 0-.38.06-.58.26s-.76.74-.76 1.8c0 1.06.78 2.08 .89 2.22 .12 .14 1.54 2.34 3.72 3.28 2 .86 2 .58 2.36 .54 .36 -.04 1.43 -.58 1.63 -1 .2 -.42 .2 -.78 .14 -.9 -.06 -.12 -.22 -.18 -.46 -.3z"/>
      </svg>)
  }
];

const Footer = () => (
<>
  <footer className="footer">
    
    <div className="footer1">
      <div className="footer-content">
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
      <div><a href="https://alumni.iiti.ac.in/" target="_blank" rel="noopener noreferrer">ACR Office</a></div>
      <div><a href="https://academic.iiti.ac.in/" target="_blank" rel="noopener noreferrer">Academics</a></div>
      <div><a href="https://studentaffairs.iiti.ac.in/" target="_blank" rel="noopener noreferrer">Student Affairs</a></div>
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
        <div className="mail">
          <div className="flex justify-center items-center gap-2 sub-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" fill="currentColor" class="bi bi-envelope" viewBox="0 0 24 10">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
          </svg>
          <a href="mailto:acroffice@iiti.ac.in">acroffice@iiti.ac.in</a>
          </div>
          <div className="flex gap-2 justify-center items-center sub-section">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-envelope" viewBox="0 0 24 24">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
            </svg>
            <a href="mailto:alumnicell@iiti.ac.in">alumnicell@iiti.ac.in</a>
            </div>
        </div>
     </div>
    </div><div
  style={{
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "20px"
  }}
>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29483.636549601182!2d75.89017811562502!3d22.524638499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962efcccbce7145%3A0x784e8cb69818596b!2sIndian%20Institute%20of%20Technology%20Indore!5e0!3m2!1sen!2sin!4v1764866836815!5m2!1sen!2sin"
    style={{
      border: 0,
      width: "80vw",
      height: "50vw",
      maxWidth: "90vw",
      maxHeight: "200px",
      borderRadius: "10px"
    }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

 </div>
    
  </footer>
  <div className="rights">© {new Date().getFullYear()} - All Rights with IIT Indore</div>
  </>
);

export default Footer;
