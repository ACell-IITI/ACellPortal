import React, { useEffect, useState } from 'react';
import RegistrationForm from '../Components/RegistrationForm/RegistrationForm';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const SaathiRegistrationPage = () => {
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleNStatus = async () => {
      try {
        const res = await axios.get('http://localhost:8000/auth/check', {
          withCredentials: true,
        });
        console.log(res.data.status);
        setRole(res.data.role);
        setStatus(res.data.status);
      } catch (error) {
        console.log('Error while sending request to check route', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleNStatus();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (role !== 'alumni') {
    return <Navigate to="/Login" />;
  } else if (status === 'verified') {
    return <h1>You are already a mentor</h1>;
  }

  return (
    <div>
      <RegistrationForm />
    </div>
  );
};

export default SaathiRegistrationPage;
