import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Eventh.css"; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from "axios";

import { useNavigate } from "react-router-dom";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EventCarousel = () => {
  const navigate = useNavigate();
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
        const res = await axios.get("https://alumnicell.iiti.ac.in/api/admin/get-programs");
        const onlyEvents = res.data.data.filter(item => item.type === "event");
        setEvents(onlyEvents);
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

  if (events.length === 0) {
    return (
      <div className="carousel-container">
        <p className="text-center text-gray-500 py-8">No events available.</p>
      </div>
    );
  }

  // If less than 3 events, show in a grid instead of carousel
  if (events.length < 3) {
    return (
      <div className="carousel-container">
        <div className="flex justify-center gap-8 flex-wrap">
          {events.map((event) => (
            <div key={event._id} className="event-slide" style={{ width: 'auto', padding: '30px 20px' }}>
              <div className="event-card" style={{ width: '300px', margin: '0 auto', cursor: 'pointer' }} onClick={() => navigate(`/about-eventProgram/${event._id}`)}>
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
        </div>
      </div>
    );
  }

  // For 3+ events, use carousel
  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {events.map((event) => (
          <div key={event._id} onClick={() => navigate(`/about-eventProgram/${event._id}`)} className="event-slide">
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


