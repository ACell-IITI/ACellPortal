import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProgramH.css"; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const programs = [
  {
    image: "/Media/cv.jpg",
    title: "CV Review Drive",
    date: "July 6, 2025",
    time: "05:00 AM",
    venue:"IIT Indore",
  },
  {
    image: "/Media/ah.png",
    title: "Alumni Hour",
    date: "April, 2025",
    time: "09:00 AM",
    venue:"IIT Indore",
  },
  {
    image: "/Media/cmeet1.jpg",
    title: "Alumni Hour",
    date: "April 20, 2025",
    time: "4:30 PM",
    venue:"IIT Indore",
  },
  {
    image: "/Media/mopus.png",
    title: "Magnum Opus",
    date: "Jan 11-12, 2025",
    time: "9:00 AM",
    venue:"IIT Indore",
  },
  {
    image: "/Media/cmeet1.jpg",
    title: "Alumni Hour",
    date: "April 20, 2025",
    time: "4:30 PM",
    venue:"IIT Indore",
  },
  {
    image: "/Media/mopus.png",
    title: "Magnum Opus",
    date: "Jan 11-12, 2025",
    time: "9:00 AM",
    venue:"IIT Indore",
  },
  {
    image: "/Media/mopus.png",
    title: "Magnum Opus",
    date: "Jan 11-12, 2025",
    time: "9:00 AM",
    venue:"IIT Indore",
  },
];

const Program = () => {
const settings = {
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000, // 3 seconds between auto-scroll
  speed: 800,          // transition animation speed
  slidesToShow: 3,
  slidesToScroll: 1,
  cssEase: "ease",
  arrows: true,
  pauseOnHover: true,
   responsive: [
    {
      breakpoint: 750, // Below 1200px
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
};


    useGSAP(() => {
      // gsap code here...
      gsap.from('.program-container', 
         
         {
           y:10,
         opacity: 0,
         duration: 0.1,
         ease: "power1.in",
         scrollTrigger: {
           trigger: '.program-container',
           scroller: 'body',
           start: 'top 40%', // Animation starts when top of the card reaches 60% of the viewport
           end:'top 50%',
           scrub:2,
         } 
   
         }); // <-- automatically reverted
    },);
  
  return (
    <div className="program-container">
      <Slider {...settings}>
        {programs.map((program, index) => (
          <div key={index} className="program-slide">
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
