import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Eventh.css"; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const events = [
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

const Carousel = () => {
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
      gsap.from('.carousel-container ', 
         
         {
           y:10,
         opacity: 0,
         duration: 0.1,
         ease: "power1.in",
         scrollTrigger: {
           trigger: '.carousel-container',
           scroller: 'body',
           start: 'top 80%', 
           end:'top 60%',
           scrub:2,
         } 
   
         }); 
    },);
  
  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {events.map((event, index) => (
          <div key={index} className="event-slide">
            <div className="event-card">
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">📅 {event.date}</p>
                <p className="event-time">⏰ {event.time}</p>
                <p className="event-venue">📍 {event.venue}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;


