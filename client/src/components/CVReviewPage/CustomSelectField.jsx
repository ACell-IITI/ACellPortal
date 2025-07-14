import React, { useState, useRef, useEffect } from "react";
import "../../styles/CVReviewPage/CustomSelectField.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CustomSelectField = ({ label, options }) => {
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="cv-input-group">
      <label>{label}</label>
      <div className="custom-select-wrapper" ref={dropdownRef}>
        <div
  className={`custom-select-display ${isOpen ? "active" : ""}`}
  onClick={toggleDropdown}
  tabIndex={0}
  onBlur={() => setIsOpen(false)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") toggleDropdown();
  }}
>
          {selected}
          <i className="fas fa-chevron-down select-icon" />
        </div>
        {isOpen && (
          <ul className="custom-select-options">
            {options.map((opt, idx) => (
              <li
                key={idx}
                className={`custom-option ${opt === selected ? "selected" : ""}`}
                onMouseDown={() => handleSelect(opt)} 
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelectField;
