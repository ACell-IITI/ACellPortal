// src/components/UserDropdown/UserDropdown.js
import React, { useState, useRef, useEffect } from "react";
import "./UserDropdown.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
      window.location.reload(); // or navigate('/') if using useNavigate
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
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
