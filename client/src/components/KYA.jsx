// src/components/KYA.jsx
import React, { useEffect, useRef, useState } from "react";
import AlumniCard from "./AlumniCard";
import axios from "axios";
import { motion } from "framer-motion";

const KYA = () => {
  const headingRef = useRef(null);
  const paraRef = useRef(null);

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://alumnicell.iiti.ac.in:3008/admin/get-kya-profiles")
      .then((res) => {
        console.log(res.data)
        if (res.data && Array.isArray(res.data.data)) {
          setProfiles(
            res.data.data.map((item) => ({
              profilePic: item.profilePic || "/placeholder.jpg",
              Name: item.Name || "",
              batch: item.Batch || "",
              role: item.CurrRole || "",
              bio: item.ShortBio || "",
              achievement: item.Achievement || "",
              LinkedInPostLink: item.LinkedInPostLink || "#",
            }))
          );
        } else {
          console.error("Unexpected API response:", res.data);
          setProfiles([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching KYA profiles: ", err);
        setProfiles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading profiles...</p>;
  }

  if (profiles.length === 0) {
    return <p>No profiles found from backend.</p>;
  }

  return (
    <div>
      {/* Header Section */}
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

      {/* Grid of Alumni Profiles */}
      <div className="min-h-screen bg-[#F6F6C9]/10 px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-10">
          {profiles.map((alumni, idx) => (
            <AlumniCard key={idx} alumni={alumni} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KYA;
