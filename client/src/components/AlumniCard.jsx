// src/components/AlumniCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
const AlumniCard = ({ alumni }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col md:flex-row items-center justify-between w-full p-6 bg-white rounded-2xl shadow-xl max-w-5xl mx-auto mt-12 md:space-x-8 space-y-6 md:space-y-0 transition-all duration-300 hover:shadow-5xl border border-gray-100"
    >
      {/* Image Section */}
      <div className="w-full md:w-1/3 flex justify-center">
        <motion.img
          src={alumni.photo}
          alt={alumni.name}
          className="w-full max-w-[240px] h-[240px] object-cover rounded-xl shadow-md hover:scale-105 transition duration-300"
          whileHover={{ scale: 1.05 }}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between text-left space-y-4">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center md:text-left">
          {alumni.name}
        </h2>
        <p className="text-gray-700 text-sm sm:text-base font-medium">
          🎓 Batch: <span className="text-gray-800">{alumni.batch}</span>
        </p>
        <p className="text-gray-700 text-sm sm:text-base font-medium">
          🧑‍💼 Role: <span className="text-gray-800">{alumni.role}</span>
        </p>
        <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {alumni.bio}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-evenly mt-4">
          <motion.a
            href={alumni.LinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
           
          >
            <button className="group relative px-6 py-3 bg-gradient-to-r from-[#F6F6C9] via-[#BAD1C2] to-[#4FA095] text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4FA095] via-[#BAD1C2] to-[#F6F6C9] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <span className="relative flex items-center gap-3 tracking-wide text-base">
              LinkedIn <Linkedin size={18}  />
            </span>
          </button>
          </motion.a>

          <motion.a
            href={alumni.CompanyLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
           
          >
             <button className="group relative px-6 py-3 bg-gradient-to-r from-[#F6F6C9] via-[#BAD1C2] to-[#4FA095] text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4FA095] via-[#BAD1C2] to-[#F6F6C9] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <span className="relative flex items-center gap-3 tracking-wide text-base">
              About Company     <ExternalLink size={18}/>
            </span>
          </button>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default AlumniCard;
