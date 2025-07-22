import React, { useRef } from "react";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import "../../styles/LoginPage/LoginForm.css";
import { Link } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginForm = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const alumniEmail = emailRef.current?.value.trim();
    const password = passwordRef.current?.value;

    try {
      const res = await axios.post("http://localhost:8000/auth/alumni/login", {
        alumniEmail,
        password,
      }, { withCredentials: true, });
      console.log("Logged in successfully:", res.data);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  };

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
        <h2 className="login-title">LOGIN PORTAL</h2>
        <img src="/assets/IIT_Indore_Logo.png" alt="IIT Logo" className="logo-img"/>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
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
      <GoogleLogin
          type={"standard"}
          theme={"outline"}
          size={"large"}
          text={"signin_with"}
          shape={"rectangular"}
          logo_alignment={"center"}
          onSuccess={async credentialResponse => {
            const res = await axios.post('http://localhost:8000/auth/google', {
              token: credentialResponse.credential,
            }, {withCredentials: true,
            });
            console.log('User logged in:', res.data);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      <div className="login-footer">
        <h6 className="signup-warning">
          Not a Member? <Link to="/signup" className="signup-link">Sign-Up Now</Link></h6>
      </div>
    </div>
  );
};

export default LoginForm;
