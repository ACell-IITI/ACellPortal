import React, { useRef } from "react";
import InputField from "../LoginPage/InputField";
import PasswordField from "../LoginPage/PasswordField";
// import "../../styles/LoginPage/SignUpForm.css";
import "../../styles/LoginPage/LoginForm.css";
import { Link } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = nameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value;

    if (!fullName || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/auth/alumni/signup",{
          alumniName : fullName,
          alumniEmail: email,
          password: password,
        },
        { withCredentials: true}
      );
      console.log("Signup success:", res.data);
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/assets/alumni cell logo.jpg" alt="Alumni Logo" className="logo-img" />
        <h2 className="login-title">SIGN UP PORTAL</h2>
        <img src="/assets/IIT_Indore_Logo.png" alt="IIT Logo" className="logo-img"/>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
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
          Already a member? <Link to="/Login" className="signup-link">Login Now</Link></h6>
      </div>
    </div>
  );
};

export default SignUpForm;
