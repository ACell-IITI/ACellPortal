// src/components/KYA.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AlumniCard from './AlumniCard';
import { AlumniData } from '../lib/data';
import {motion } from 'framer-motion'


const KYA = () => {


  const headingRef = useRef(null);
  const paraRef = useRef(null);

  const [index, setIndex] = useState(0);
  const total = AlumniData.length;


  const nextCard = () => setIndex((prev) => (prev + 1) % total);
  const prevCard = () => setIndex((prev) => (prev - 1 + total) % total);

  return (
    <div>
    <div
  className="text-center py-10 md:py-14 shadow-md bg-cover bg-center relative"
  style={{ backgroundImage: "url('/Texture.png')" }}
>
  <div className="bg-black/40 absolute inset-0 z-0"></div>
  <div className="relative z-10">
    
    <div className="flex justify-center items-center gap-4">
   
      <motion.div
        initial={{ x: -200, rotate: -360, opacity: 0 }}
        animate={{ x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          src="/Logo.png"
          alt="Logo"
          className="w-[60px] h-[60px] drop-shadow-lg"
        />
      </motion.div>

    
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md tracking-wide"
      >
        Know Your Alumni
      </motion.h1>
    </div>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="text-lg md:text-xl text-white/80 mt-4 px-6 max-w-3xl mx-auto"
    >
      Explore the journeys and achievements of our distinguished alumni.
    </motion.p>
  </div>
</div>

{/* Main Content */}
<div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6C9]/10 px-4">
  <AlumniCard alumni={AlumniData[index]} />

  <div className="flex mt-6 gap-4">
    <motion.div
      className="flex mt-6 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.button
        onClick={prevCard}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white shadow-md hover:bg-[#4FA095]/30 transition-colors duration-300"
      >
        <ArrowLeft className="text-gray-600 group-hover:text-white transition-colors duration-200" />
      </motion.button>

      <motion.button
        onClick={nextCard}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white shadow-md hover:bg-[#4FA095]/30 transition-colors duration-300"
      >
        <ArrowRight className="text-gray-600 group-hover:text-white transition-colors duration-200" />
      </motion.button>
    </motion.div>
  </div>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.4 }}
    className="mt-4 text-sm font-medium text-gray-600 tracking-wide bg-white px-4 py-1 rounded-full shadow-sm border border-gray-200"
  >
    {index + 1} <span className="text-gray-400 ">/</span> {total}
  </motion.p>
</div>

    </div>
  );
};

export default KYA;
