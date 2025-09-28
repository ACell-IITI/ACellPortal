import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProgramH.css"; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from "axios";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Program = () => {
  const [programs, setPrograms] = useState([]);

  
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/get-programs");
        setPrograms(res.data.data); 
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    fetchPrograms();
  }, []);

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: "ease",
    arrows: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 750, 
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 450, 
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  useGSAP(() => {
    gsap.from('.program-container', {
      y: 10,
      opacity: 0,
      duration: 0.1,
      ease: "power1.in",
      scrollTrigger: {
        trigger: '.program-container',
        scroller: 'body',
        start: 'top 40%',
        toggleActions: 'play none none none'
      }
    }); 
  });

  return (
    <div className="program-container">
      <Slider {...settings}>
        {programs.filter((program) => program.type === "program")
    .map((program) =>(
          <div key={program._id} className="program-slide">
            <div className="program-card">
              <img
                src={program.image}
                alt={program.title}
                className="program-image"
              />
              <div className="program-content">
                <h3 className="program-title">{program.title}</h3>
                <p className="program-date">📅 {program.date}</p>
                <p className="program-time">⏰ {program.time}</p>
                <p className="program-venue">📍 {program.venue}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Program;
