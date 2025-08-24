// src/components/UserDropdown/UserDropdown.js
import React, { useState, useRef, useEffect } from "react";
import "./UserDropdown.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../api/alumni";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      window.location.href="/";
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <button className="user-icon-btn" onClick={toggleDropdown}>
        <FaUserCircle size={38} />
      </button>
      {open && (
        <div className="user-dropdown-menu">
          <button 
            onClick={handleLogout}
            className="bg-slate-500 hover:bg-slate-200 active:bg-slate-400 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
};

export default UserDropdown;
