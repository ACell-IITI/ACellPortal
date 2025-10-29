import React , {useEffect, useState} from 'react'
import './Home.css'
import Eventh from '../Components/Eventh/Eventh'
import Program from '../Components/ProgramH/ProgramH'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Registerbtn from '../Components/Registerbtn/Registerbtn'
import RegistrationForm from '../Components/RegistrationForm/RegistrationForm'
import { Link } from "react-router-dom";
import { API_BASE_URL } from '../api/alumni';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useGSAP(() => {
  gsap.from('.pr', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.5,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.pr',
      scroller: 'body',
      start: 'top 60%',
      toggleActions: 'play none none none' 
    }
  });

  gsap.from('.eve', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.5,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.eve',
      scroller: 'body',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('.saathih', {
    y: 100,
    opacity: 0,
    duration: 0.7,
    delay: 0.5,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.saathih',
      scroller: 'body',
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  });
});
const [recentPhotos, setRecentPhotos] = useState([]);


useEffect(() => {
  fetch(`${API_BASE_URL}/api/gallery/recent`)
    .then((res) => res.json())
   .then((data) => {setRecentPhotos(data);
      });
}, []);

  return (
    <>
    <div className="banner">
    <div className="content-wrapper">
        
          <div className="textbox">
            <h2 className="text ">Welcome To</h2>
            <div className="typewriter">Alumni Cell</div>
            <h1 className="cell-desc">Connecting Legacies, Inspiring Futures — Where Alumni Meet, Memories Live, and New Journeys Begin.</h1>

            <a href="https://alumni.iiti.ac.in/" target="_blank" rel="noopener noreferrer"><button className="join-btn">
                Join the Alumni Network
              </button>
            </a>

          </div>
          <img
           src="/Media/iitiabhi1.jpg"
            alt="iitiabhinandan"
            className="iitabhi1 "
          />
        </div>
        </div>
 {/* Gallery */}
<div className="w-[90%] max-w-6xl mx-auto my-10">
      <h2 className="text-4xl font-bold mb-6 text-center">Gallery</h2>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {recentPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative mb-3 break-inside-avoid overflow-hidden rounded-2xl shadow-md group"
          >
            <img
              src={photo.image}
              alt={`Gallery item ${index + 1}`}
              className="w-full h-auto rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 mb-10">
        <Link
          to="/gallery"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
        >
          View more
        </Link>
      </div>
    </div>

{/* PROGRAM & WEBINARS */}
        <div className="program-section">
  <img className='bubble' src='/Media/bubble.png'></img>
    <img className='bubble1' src='/Media/bubble.png'></img>
<p className="titlec pr">PROGRAM & WEBINARS</p>
<p className="subtitlec pr">
  Explore our upcoming sessions and expert-led discussions to boost your professional journey.
</p>
<Program />
</div>
{/* EVENTS */}
<div className="event-section">
<p className="titlec eve">EVENTS</p>
<p className="subtitlec eve">
  Stay updated on recent and future events held at IIT Indore and beyond.
</p>
<Eventh />
</div>
{/* Saathi banner */}

   <div  className="saathih"> <img className='bubble' src='/Media/bubble.png'></img>
    <img className='bubble1' src='/Media/bubble.png'></img>
    <img src='/Media/saathi-banner.png' alt='saathi' className="saathi11"></img>
      
      {/* <Registerbtn/> */}

   </div>
  </>
  )
}

export default Home
