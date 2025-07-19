import React, { useRef } from "react";
import InputField from "../LoginPage/InputField";
import PasswordField from "../LoginPage/PasswordField";
// import "../../styles/LoginPage/SignUpForm.css";
import "../../styles/LoginPage/LoginForm.css";
import { Link } from 'react-router-dom';



const SignUpForm = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef?.current) {
      e.preventDefault(); 
      nextRef.current.focus();
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/assets/alumni cell logo.jpg" alt="Alumni Logo" className="logo-img" />
        <h2 className="login-title">SIGN UP PORTAL</h2>
        <img src="/assets/IIT_Indore_Logo.png" alt="IIT Logo" className="logo-img"/>
      </div>

      <form className="login-form">
        <InputField
          label="Full Name"
          type="text"
          inputRef={nameRef}
          onKeyDown={(e) => handleKeyDown(e, emailRef)}
        />
        <InputField
          label="Email ID"
          type="email"
          inputRef={emailRef}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
        />
        <PasswordField
          inputRef={passwordRef}
          onKeyDown={(e) => handleKeyDown(e, null)}
        />
        <button className="submit-button" type="submit">Submit</button>
      </form>
      <div className="login-footer">
        <h6 className="signup-warning">
          Already a member? <Link to="/Login" className="signup-link">Login Now</Link></h6>
      </div>
    </div>
  );
};

export default SignUpForm;
