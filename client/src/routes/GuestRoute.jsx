// src/routes/GuestRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function GuestRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://alumnicell.iiti.ac.in:3008/auth/check", {
          withCredentials: true,
        });
        setLoggedIn(!!res.data.role);
      } catch (err) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return loggedIn ? <Navigate to="/" /> : children;
}
