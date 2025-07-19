import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignupUpButton.css";

const SignupUpButton = ({ children }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Signup"); 
  };

  return (
    <button className="signupup-btn" onClick={handleClick}>
      <span className="label">Sign-up/login</span>
      {children}
      <span className="accent"></span>
      <span className="arrow1"></span>
    </button>
  );
};

export default SignupUpButton;
