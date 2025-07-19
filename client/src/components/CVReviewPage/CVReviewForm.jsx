import React, { useEffect, useRef } from "react";
import "../../styles/CVReviewPage/CVReviewForm.css";
import InputField from "./InputField";
import CustomSelectField from "./CustomSelectField";

const CVReviewForm = () => {
  const nameRef = useRef();
  const rollRef = useRef();
  const emailRef = useRef();
  const cvRef = useRef();
  const submitBtnRef = useRef();
  const headingRef = useRef();

  // Typewriter cursor removal after animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (headingRef.current) {
        headingRef.current.style.borderRight = "none";
      }
    }, 2500); // Match with animation duration
    return () => clearTimeout(timeout);
  }, []);

  // Navigate fields with Enter key
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted!");
  };

  return (
    <div className="cv-container">
      <div className="cv-left">
        <h2 className="typewriter-text" ref={headingRef}>
          SUBMIT YOUR CV
        </h2>
        <p className="fade-in-text">Get expert feedback from experienced seniors</p>
      </div>
      <div className="cv-form-box">
        <form
          className="cv-form"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            const tag = e.target.tagName.toLowerCase();
            const type = e.target.type?.toLowerCase();
            if (e.key === "Enter" && !(type === "submit" || tag === "textarea")) {
              e.preventDefault(); // prevent accidental form submit
            }
          }}
        >
          <InputField
            label="Full Name"
            inputRef={nameRef}
            placeholder="Enter your Full Name"
            onKeyDown={(e) => handleKeyDown(e, rollRef)}
            type="text"
          />
          <InputField
            label="Roll No."
            inputRef={rollRef}
            placeholder="Enter your Roll no."
            onKeyDown={(e) => handleKeyDown(e, emailRef)}
            type="text"
          />
          <InputField
            label="Email ID"
            inputRef={emailRef}
            placeholder="Enter your Institute Email ID"
            onKeyDown={(e) => handleKeyDown(e, cvRef)}
            type="email"
          />
          <InputField
            label="CV Drive Link"
            inputRef={cvRef}
            placeholder="https://drive.google.com/..."
            type="url"
            onKeyDown={(e) => handleKeyDown(e, null)} // last field
          />

          <CustomSelectField
            label="Target Profile"
            options={["Core", "Software","Consulting","Finance/Quant","Data Science","Product/FMCG"]}
          />

          <button
            ref={submitBtnRef}
            type="submit"
            className="cv-submit-btn"
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default CVReviewForm;
