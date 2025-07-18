import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home/Home'
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar'
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import LoginPage from './pages/LoginPage';
import CVReviewPage from './pages/CVReviewPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RegistrationForm" element={<RegistrationForm />} />
          <Route path="/cv-review" element={<CVReviewPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
