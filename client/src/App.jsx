import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home/Home'
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar'
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
function App() {

  return (
    <>
     <BrowserRouter>
     <Navbar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/RegistrationForm" element={<RegistrationForm />} />
    </Routes>
    <Footer/>
  </BrowserRouter>
       
    </>
  )
}

export default App