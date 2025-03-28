import React, { useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { IoChatbubbleEllipsesOutline, IoClose } from "react-icons/io5";
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWindow from './components/ChatWindow';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Verify from './pages/Verify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './pages/Hero';
import Programs from './pages/programs';
import VisitedDoctors from './components/VisitedDoctors';
import MedicalRecords from './components/MedicalRecords';



const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const programsRef = useRef(null);
  const location = useLocation();

  const scrollToPrograms = () => {
    programsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path='/' element={<Hero scrollToPrograms={scrollToPrograms} />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/home' element={<Home />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path="/visited-doctors" element={<VisitedDoctors />} />
        <Route path="/medical-records/:doctorId" element={<MedicalRecords />} />
       
       
      </Routes>

      {/* Render Programs only on the homepage */}
      {location.pathname === '/' && (
        <div ref={programsRef}>
          <Programs />
        </div>
      )}

      <Footer />
            {/* Floating Chat Icon */}
            {!isChatOpen && (
        <button className="chat-icon" onClick={() => setIsChatOpen(true)}>
          <IoChatbubbleEllipsesOutline size={30} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-container">
          <button className="close-btn" onClick={() => setIsChatOpen(false)}>
            <IoClose size={24} />
          </button>
          <ChatWindow />
        </div>
      )}
    </div>
  );
};

export default App;
