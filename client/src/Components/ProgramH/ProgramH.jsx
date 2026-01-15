import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProgramH.css"; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from "axios";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Program = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get("http://alumnicell.iiti.ac.in:3008/api/admin/get-programs");
        setPrograms(res.data.data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((program) => program.type === "program");

  const settings = {
    infinite: filteredPrograms.length >= 3,
    autoplay: filteredPrograms.length >= 3,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: Math.min(3, filteredPrograms.length),
    slidesToScroll: 1,
    cssEase: "ease",
    arrows: filteredPrograms.length > 1,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 750,
        settings: {
          slidesToShow: Math.min(3, filteredPrograms.length),
          slidesToScroll: 1,
          infinite: filteredPrograms.length >= 3,
          autoplay: filteredPrograms.length >= 3,
          arrows: filteredPrograms.length > 1,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: Math.min(1, filteredPrograms.length),
          slidesToScroll: 1,
          infinite: filteredPrograms.length >= 1,
          autoplay: filteredPrograms.length >= 1,
          arrows: filteredPrograms.length > 1,
        },
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

  if (filteredPrograms.length === 0) {
    return (
      <div className="program-container">
        <p className="text-center text-gray-500 py-8">No programs available.</p>
      </div>
    );
  }

  // If less than 3 programs, show in a grid instead of carousel
  if (filteredPrograms.length < 3) {
    return (
      <div className="program-container">
        <div className="flex justify-center gap-8 flex-wrap">
          {filteredPrograms.map((program) => (
            <div key={program._id} className="program-slide" style={{ width: 'auto', padding: '30px 20px' }}>
              <div className="program-card" style={{ width: '300px', margin: '0 auto', cursor: 'pointer' }} onClick={() => navigate(`/about-eventProgram/${program._id}`)}>
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
        </div>
      </div>
    );
  }

  // For 3+ programs, use carousel
  return (
    <div className="program-container">
      <Slider {...settings}>
        {filteredPrograms.map((program) =>(
          <div key={program._id} onClick={() => navigate(`/about-eventProgram/${program._id}`)} className="program-slide">
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
