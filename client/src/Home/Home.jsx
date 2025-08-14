import React from 'react'
import './Home.css'
import Eventh from '../Components/Eventh/Eventh'
import Program from '../Components/ProgramH/ProgramH'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Registerbtn from '../Components/Registerbtn/Registerbtn'
import RegistrationForm from '../Components/RegistrationForm/RegistrationForm'
import { Link } from "react-router-dom";

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
      toggleActions: 'play none none none'  // play once on entering trigger, no reverse
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

  return (
    <>
    <div className="banner">
    <div className="content-wrapper">
        
          <div className="textbox">
            <h2 className="text ">Welcome To</h2>
            <div className="typewriter">Alumni Cell</div>
            <h1 className="cell-desc">Connecting Legacies, Inspiring Futures — Where Alumni Meet, Memories Live, and New Journeys Begin.</h1>
            <Link to="/Signup">
      <button className="join-btn">
        Join the Alumni Network
      </button>
    </Link>
          </div>
          <img
           src="/Media/iitiabhi1.jpg"
            alt="iitiabhinandan"
            className="iitabhi1 "
          />
        </div>
        </div>
        <div className="program-section">
  <img className='bubble' src='/Media/bubble.png'></img>
    <img className='bubble1' src='/Media/bubble.png'></img>
<p className="titlec pr">PROGRAM & WEBINARS</p>
<p className="subtitlec pr">
  Explore our upcoming sessions and expert-led discussions to boost your professional journey.
</p>
<Program />
</div>
<div className="event-section">
<p className="titlec eve">EVENTS</p>
<p className="subtitlec eve">
  Stay updated on recent and future events held at IIT Indore and beyond.
</p>
<Eventh />
</div>

   <div  className="saathih"> <img className='bubble' src='/Media/bubble.png'></img>
    <img className='bubble1' src='/Media/bubble.png'></img>
    <img src='/Media/Saathi11.png' alt='saathi' className="saathi11"></img>
      
      <Registerbtn/>

   </div>
  </>
  )
}

export default Home
