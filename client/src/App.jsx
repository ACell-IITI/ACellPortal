import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home/Home";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
// import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";

import KYA from "./Components/KYA";

import LoginPage from "./pages/LoginPage";
import CVReviewPage from "./pages/CVReviewPage";
import SignUpPage from "./pages/SignUpPage";
import NewsletterPage from "./pages/NewsletterPage";
import MagazinePage from "./pages/MagazinePage";
import TeamSection from "./components/TeamPage";
import SaathiRegistrationPage from "./pages/SaathiRegistrationPage";
import AdminDashboard from "./pages/AdminDashboard";
import VerifiedMentorsPage from "./pages/VerifiedMentorsPage";
import { API_BASE_URL } from "./api/alumni";
import { useEffect, useState } from "react";
import axios from "axios";
import GuestRoute from "./routes/GuestRoute";
import AdminSettings from "./pages/AdminSettings";


function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/check`, {
          withCredentials: true,
        });
        setIsAdmin(res.data.role === "admin");
      } catch (err) {
        console.error("Error fetching role:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAdmin ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
           <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration-form" element={<SaathiRegistrationPage />} />

          <Route path="/Login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/SignUp" element={<GuestRoute><SignUpPage /></GuestRoute>} />

          <Route path="/cv-review" element={<CVReviewPage />} />
          <Route path="/admin-settings" element={<AdminSettings />} />

          <Route path="/Newsletter" element={<NewsletterPage />} />
          <Route path="/Magazine" element={<MagazinePage />} />
          <Route path="/KYA" element={<KYA />} />
          <Route path="/team" element={<TeamSection />} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/verified-mentors" element={<VerifiedMentorsPage />} />
        </Routes>
        <Footer />
       
      </BrowserRouter>
    </>
  );
}

export default App;
