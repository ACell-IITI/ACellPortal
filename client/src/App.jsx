import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";
import LoginForm from "./Components/LoginPage/LoginForm";
import CVReviewForm from "./Components/CVReviewPage/CVReviewForm";
import KYA from "./pages/KYA";
import Newsletter from "./pages/Newsletter";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RegistrationForm" element={<RegistrationForm />} />
          <Route path="/Signup" element={<LoginForm />} />
          <Route path="/cv-review" element={<CVReviewForm />} />
          <Route path="/kya" element={<KYA />}></Route>
          <Route path="/newsletters" element={<Newsletter />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
