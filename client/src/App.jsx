import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home/Home'
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar'
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import LoginForm from './Components/LoginPage/LoginForm';
import CVReviewForm from './Components/CVReviewPage/CVReviewForm';
// import NewsletterPage from './pages/NewsletterPage';
// import Newsletter from './Components/NewsletterPage/Newsletter';
import NewsletterPage from './pages/NewsletterPage';
import MagazinePage from './pages/MagazinePage';

function App() {

  return (
    <>
     <BrowserRouter>
     <Navbar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/RegistrationForm" element={<RegistrationForm />} />
      <Route path='/Signup' element={<LoginForm />} />
      <Route path ='/cv-review' element={<CVReviewForm/>} />
      <Route path ='/Newsletter' element={<NewsletterPage/>} />
      {/* <Route path='/NewsletterPage' element={<NewsletterPage/>} /> */}
      <Route path='/Magazine' element={<MagazinePage/>} />  
    </Routes>
    <Footer/>
  </BrowserRouter>
       
    </>
  )
}

export default App