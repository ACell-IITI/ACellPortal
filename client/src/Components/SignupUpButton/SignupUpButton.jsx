import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignupUpButton.css";

const SignupUpButton = ({ children }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Login"); 
  };

  return (
    <button className="signupup-btn" onClick={handleClick}>
      <span className="label">Login</span>
      {children}
      <span className="accent"></span>
      <span className="arrow1"></span>
    </button>
  );
};

export default SignupUpButton;
