import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";



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
        rounded-2xl
        shadow-sm hover:shadow-xl
        border border-gray-100
        p-4 sm:p-6
        flex flex-col items-center text-center
      "
    >
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative mb-4"
      >
        <div
          className="
            w-20 h-20
            sm:w-24 sm:h-24
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
            w-7 h-7
            bg-gradient-to-br from-blue-500 to-teal-500
            rounded-full flex items-center justify-center
            shadow-lg text-white text-xs
          "
        >
          ⭐
        </div>
      </motion.div>

      <h3 className="text-sm sm:text-base font-semibold text-gray-900">
        {alumni.name}
      </h3>

      <p className="text-xs text-gray-500 tracking-wide">
        Batch of {alumni.batch}
      </p>
    </motion.div>
  );
};

const AlumniContributions = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://alumnicell.iiti.ac.in/api/alumni-contributions")
      .then((res) => res.json())
      .then((data) => setAlumniData(data))
      .catch((err) =>
        console.error("Error fetching alumni contributions:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          Loading alumni contributions...
        </p>
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
        
        
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h1
            variants={fadeUp}
            className="
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              font-bold text-gray-900
              mb-4 tracking-tight
            "
          >
            Alumni Contributors
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
            Honouring our alumni who supported{" "}
            <span className="font-medium">Magnum Opus</span>
          </motion.p>
        </motion.header>

        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            lg:grid-cols-6
            gap-4 sm:gap-6
          "
        >
          {alumniData.map((alumni) => (
            <AlumniCard key={alumni._id} alumni={alumni} />
          ))}
        </motion.div>
      </div>


    </motion.div>
  );
};

export default AlumniContributions;
