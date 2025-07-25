import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Registerbtn.css';

const Registerbtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/registration-form');
  };

  return (
    <button onClick={handleClick} className="register-button">
      REGISTER NOW
    </button>
  );
};

export default Registerbtn;
