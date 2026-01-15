import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './Home/Home';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar';
// import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";

import KYA from './Components/KYA';

import LoginPage from './pages/LoginPage';
import CVReviewPage from './pages/CVReviewPage';
// import SignUpPage from "./pages/SignUpPage";

import NewsletterPage from "./pages/NewsletterPage";
import MagazinePage from "./pages/MagazinePage";
import YearbookPage from "./pages/YearbookPage";
import TeamSection from "./components/TeamPage";
import SaathiRegistrationPage from "./pages/SaathiRegistrationPage";
import AdminDashboard from "./pages/AdminDashboard";
import VerifiedMentorsPage from "./pages/VerifiedMentorsPage";
import { API_BASE_URL } from "./api/alumni";
import { useEffect, useState } from "react";
import axios from "axios";
import GuestRoute from "./routes/GuestRoute";
import Gallery from "./Components/Gallery/Gallery";

import AboutEvent from './pages/AboutEvent';

import AlumniContribution from "./pages/AlumniContribution";
import Sponsors from "./pages/Sponsors";
import EventsPage from "./pages/EventsPage";


// import AdminSettings from "./pages/AdminSettings";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/check`, {
          withCredentials: true,
        });
        setIsAdmin(res.data.role === 'admin');
      } catch (err) {
        console.error('Error fetching role:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, []);
  if (loading) return <div>Loading...</div>;
  return isAdmin ? children : <Navigate to="/adminlogin" />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div style={{ height: '100px', backgroundColor: '#153462' }}></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/registration-form"
            element={<SaathiRegistrationPage />}
          />

          <Route
            path="/adminlogin"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          {/* <Route path="/SignUp" element={<GuestRoute><SignUpPage /></GuestRoute>} /> */}
          <Route path="/about-eventProgram/:id" element={<AboutEvent />} />

          <Route path="/cv-review" element={<CVReviewPage />} />
          {/* <Route path="/admin-settings" element={<AdminSettings />} /> */}

          <Route path="/Newsletter" element={<NewsletterPage />} />
          <Route path="/Magazine" element={<MagazinePage />} />
          <Route path="/Yearbook" element={<YearbookPage />} />
          <Route path="/KYA" element={<KYA />} />
          <Route path="/team" element={<TeamSection />} />
          {/* Two New pages  */}
          <Route path="/alumni-contribution" element={<AlumniContribution />} />
          <Route path="/sponsors" element={<Sponsors />} />

          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/verified-mentors" element={<VerifiedMentorsPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
