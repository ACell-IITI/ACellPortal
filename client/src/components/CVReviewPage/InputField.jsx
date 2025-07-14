import React from "react";
import "../../styles/CVReviewPage/InputField.css";

const InputField = ({ label, inputRef, placeholder, onKeyDown, type }) => (
  <div className="cv-input-group">
    <label>{label}</label>
    <input
      ref={inputRef}
      placeholder={placeholder}
      type={type}
      onKeyDown={onKeyDown}
    />
  </div>
);

export default InputField;
