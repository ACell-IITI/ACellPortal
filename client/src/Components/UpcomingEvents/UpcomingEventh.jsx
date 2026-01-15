import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./UpcomingEventh.css"; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from "axios";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const UpcomingEventh = () => {
  const [events, setEvents] = useState([]);

useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://alumnicell.iiti.ac.in:3008/admin/get-upcoming-events");
        setEvents(res.data.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

const settings = {
    infinite: events.length >= 3,
    autoplay: events.length >= 3,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: Math.min(3, events.length),
    slidesToScroll: 1,
    cssEase: "ease",
    arrows: events.length > 1,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 750,
        settings: {
          slidesToShow: Math.min(3, events.length),
          slidesToScroll: 1,
          infinite: events.length >= 3,
          autoplay: events.length >= 3,
          arrows: events.length > 1,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: Math.min(1, events.length),
          slidesToScroll: 1,
          infinite: events.length >= 1,
          autoplay: events.length >= 1,
          arrows: events.length > 1,
        },
      },
    ],
  };


    useGSAP(() => {
      gsap.from('.program-container ', 
         
         {
           y:10,
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
    },);
  
  return (
    <div className="program-container">
      <Slider {...settings}>
        {events.map((event) => (
          <div key={event._id} className="program-slide">
            <div className="program-card">
              <img
                src={event.image}
                alt={event.title}
                className="program-image"
              />
              <div className="program-content">
                <h3 className="program-title">{event.title}</h3>
                <p className="program-date">📅 {event.date}</p>
                <p className="program-venue">📍 {event.venue}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default UpcomingEventh;


