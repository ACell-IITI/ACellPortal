import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home/Home";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
// import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";

import KYA from "./pages/KYA";

import LoginPage from "./pages/LoginPage";
import CVReviewPage from "./pages/CVReviewPage";
import SignUpPage from "./pages/SignUpPage";
import NewsletterPage from "./pages/NewsletterPage";
import MagazinePage from "./pages/MagazinePage";
import TeamSection from "./components/TeamPage";
import SaathiRegistrationPage from "./pages/SaathiRegistrationPage";
import AdminDashboard from "./pages/AdminDashboard";
import VerifiedMentorsPage from "./pages/VerifiedMentorsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration-form" element={<SaathiRegistrationPage />} />

          <Route path="/Login" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />

          <Route path="/cv-review" element={<CVReviewPage />} />

          <Route path="/Newsletter" element={<NewsletterPage />} />
          <Route path="/Magazine" element={<MagazinePage />} />
          <Route path="/KYA" element={<KYA />} />
          <Route path="/team" element={<TeamSection />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/verified-mentors" element={<VerifiedMentorsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
