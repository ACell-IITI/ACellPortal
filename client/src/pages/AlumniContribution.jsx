import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

// Random Data (removed hard-coded data)

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};


const AlumniCard = ({ alumni }) => {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="
        bg-white/80 backdrop-blur-xl
        rounded-2xl sm:rounded-3xl
        shadow-sm hover:shadow-xl
        border border-gray-100
        p-6 sm:p-8
        flex flex-col items-center text-center
      "
    >
     
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative mb-5 sm:mb-6"
      >
        <div
          className="
            w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
            rounded-full overflow-hidden
            ring-4 ring-gray-100
            shadow-md
          "
        >
          <img
            src={alumni.photo}
            alt={alumni.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="
            absolute -bottom-2 -right-2
            w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
            bg-gradient-to-br from-blue-500 to-teal-500
            rounded-full flex items-center justify-center
            shadow-lg text-white text-sm
          "
        >
          ⭐
        </div>
      </motion.div>

      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1">
        {alumni.name}
      </h3>

      <p className="text-xs sm:text-sm text-gray-500 tracking-wide">
        Batch of {alumni.batch}
      </p>
    </motion.div>
  );
};



const AlumniContributions = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/alumni-contributions")
      .then((res) => res.json())
      .then((data) => setAlumniData(data))
      .catch((err) => console.error("Error fetching alumni contributions:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading alumni contributions...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
        
      
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            variants={fadeUp}
            className="
              inline-flex items-center gap-2
              px-4 py-2
              bg-white/80 backdrop-blur
              rounded-full shadow-sm
              border border-gray-200
              mb-5 sm:mb-6
            "
          >
            <Users className="w-4 h-4 text-gray-600" />
            
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              font-bold text-gray-900
              mb-4 tracking-tight
            "
          >
            Alumni Contributions
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mb-5 rounded-full"
          />

          <motion.p
            variants={fadeUp}
            className="
              text-sm sm:text-base md:text-lg
              text-gray-600
              max-w-xl md:max-w-2xl
              mx-auto leading-relaxed
            "
          >
            Honouring our alumni who supported <span className="text-xl">Magnum Opus</span> 
          </motion.p>
        </motion.header>

       
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5 sm:gap-7 lg:gap-8
          "
        >
          {alumniData.map((alumni) => (
            <AlumniCard key={alumni._id} alumni={alumni} />
          ))}
        </motion.div>
      </div>

      <footer className="border-t border-gray-200 py-7 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
        © {new Date().getFullYear()} · Alumni Cell · IITI 
      </footer>
    </motion.div>
  );
};

export default AlumniContributions;
