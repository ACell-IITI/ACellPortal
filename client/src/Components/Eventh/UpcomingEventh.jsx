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

const UpcomingEventh = () => {
  const [events, setEvents] = useState([]);

useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://alumnicell.iiti.ac.in/api/admin/get-upcoming-events");
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
        <p className="text-center text-gray-500 py-8">No upcoming events available.</p>
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
              <div className="event-card" style={{ width: '300px', margin: '0 auto' }}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-date">📅 {event.date}</p>
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
                <p className="event-venue">📍 {event.venue}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default UpcomingEventh;


