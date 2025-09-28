import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Eventh.css"; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from "axios";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
{/*const events = [
  {
    image: "/Media/cv.jpg",
    title: "CV Review Drive",
    date: "July 6, 2025",
    time: "05:00 AM",
    venue:"IIT Indore",
  },
 
  {
    image: "/Media/NNPG.jpg",
    title: "Flagship ML",
    date: "August 24, 2025",
    time: "9:00 AM",
    venue:"IIT Indore",
  },

  {
    image: "/Media/kmt.png",
    title: "Reunion",
    date: "August 30, 2025",
    time: "9:00 AM",
    venue:"Kolkata",
  },
   {
    image: "/Media/chennaimeet.jpg",
    title: "Reunion",
    date: "july 20, 2025",
    time: "9:00 AM",
    venue:"Coal Barbecues,Chennai",
  },
];
*/}
useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/get-programs");
        const onlyEvents = res.data.data.filter(item => item.type === "event");
        setEvents(onlyEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
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
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 450, 
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


    useGSAP(() => {
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
            toggleActions: 'play none none none'
         } 
   
         }); 
    },);
  
  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {events.map((event) => (
          <div key={event._id} className="event-slide">
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

export default EventCarousel;


