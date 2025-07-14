// PasswordField.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/LoginPage/InputField.css";

const PasswordField = ({ inputRef, onKeyDown }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="lp-input-group">
      <label>Password</label>
      <div className="lp-input-wrapper">
        <input
          type={visible ? "text" : "password"}
          ref={inputRef}
          onKeyDown={onKeyDown}
          className="lp-input-with-icon"
          placeholder="Enter your password"
        />
        <FontAwesomeIcon
          icon={visible ? faEyeSlash : faEye}
          className="lp-icon-inside-input"
          onClick={() => setVisible(!visible)}
        />
      </div>
    </div>
  );
};

export default PasswordField;
