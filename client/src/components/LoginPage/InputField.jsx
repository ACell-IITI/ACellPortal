import React from "react";
import '../../styles/LoginPage/InputField.css';


const InputField = ({ label, type, inputRef, onKeyDown }) => {
  return (
    <div className="lp-input-group">
      <label>{label}</label>
      <input
        type={type}
        ref={inputRef}
        onKeyDown={onKeyDown}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default InputField;
