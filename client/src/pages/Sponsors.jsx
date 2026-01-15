import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ----------------------------------
   Animation Variants
---------------------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ----------------------------------
   Sponsor Card
---------------------------------- */
const SponsorCard = ({ sponsor }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className="group relative rounded-3xl p-[1px]"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-300/40 via-indigo-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl
                      px-5 py-7 sm:px-7 sm:py-9
                      shadow-md hover:shadow-2xl
                      transition-shadow duration-300
                      border border-white/60">
        <div className="flex flex-col items-center text-center gap-4 sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 2 }}
            transition={{ type: "spring", stiffness: 220 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-xl bg-indigo-200/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
                         bg-gradient-to-br from-indigo-50 to-indigo-100
                         flex items-center justify-center shadow-inner overflow-hidden"
            >
              <img
                src={sponsor.icon}
                alt={sponsor.name}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
              {sponsor.name}
            </h3>

            <span
              className="inline-flex mt-2 sm:mt-3
                         px-3 py-1 sm:px-4 sm:py-1.5
                         text-xs sm:text-sm
                         rounded-full bg-indigo-100/70
                         text-indigo-700 font-medium tracking-wide"
            >
              {sponsor.type}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ----------------------------------
   Sponsors Page
---------------------------------- */
const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://alumnicell.iiti.ac.in:3008/api/sponsors")
      .then((res) => res.json())
      .then((data) => setSponsors(data))
      .catch((err) => console.error("Error fetching sponsors:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50"
    >
      {/* Hero */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 text-center relative">
        <div
          className="absolute inset-0 -z-10
                     bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_60%)]"
        />

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl
                     font-bold text-gray-900 tracking-tight"
        >
          Our Sponsors
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 sm:mt-5
                     text-sm sm:text-base md:text-lg
                     text-gray-600 max-w-xl md:max-w-2xl mx-auto
                     leading-relaxed"
        >
          We sincerely thank our sponsors for empowering innovation,
          entrepreneurship, and student-led initiatives at A-Cell.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 sm:mt-8
                     w-20 sm:w-28 h-1 sm:h-1.5
                     bg-indigo-600 mx-auto rounded-full origin-left"
        />
      </section>

      {/* Sponsors Grid */}
      <section className="pb-20 sm:pb-24 md:pb-28 px-4 sm:px-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading sponsors...</p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto
                       grid grid-cols-1
                       sm:grid-cols-2
                       lg:grid-cols-3
                       gap-6 sm:gap-8 lg:gap-10"
          >
            {sponsors.map((sponsor) => (
              <SponsorCard key={sponsor._id} sponsor={sponsor} />
            ))}
          </motion.div>
        )}
      </section>


    </motion.div>
  );
};

export default Sponsors;
