import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Common Components
import Home from "./Home/Home";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";

// From `admin-dashboard`
import LoginForm from "./Components/LoginPage/LoginForm";
import CVReviewForm from "./Components/CVReviewPage/CVReviewForm";
import KYA from "./pages/KYA";
import Newsletter from "./pages/Newsletter";
import Magazine from "./pages/Magazine";

// From `main` (alternative paths)
import LoginPage from "./pages/LoginPage";
import CVReviewPage from "./pages/CVReviewPage";
import SignUpPage from "./pages/SignUpPage";
import NewsletterPage from "./pages/NewsletterPage";
import MagazinePage from "./pages/MagazinePage";
import TeamSection from "./components/TeamPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RegistrationForm" element={<RegistrationForm />} />

          {/* Keep only one login/signup flow - adjust as needed */}
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />

          {/* CV Review */}
          <Route path="/cv-review" element={<CVReviewPage />} />

          {/* Pages */}
          <Route path="/Newsletter" element={<NewsletterPage />} />
          <Route path="/Magazine" element={<MagazinePage />} />
          <Route path="/KYA" element={<KYA />} />
          <Route path="/team" element={<TeamSection />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
