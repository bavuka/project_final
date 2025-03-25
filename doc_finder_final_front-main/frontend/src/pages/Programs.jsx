import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Programs.css';
import chat from '../assets/chat.png';
import video from '../assets/video.png';
import book from '../assets/book.png';
import program1 from '../assets/program1.png';
import program2 from '../assets/program2.png';
import program3 from '../assets/program3.png';



const Programs = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="programs-container">
      <div className='title'>
        <p>Our PROGRAM</p>
        <h2 className='b'>What WE Offer</h2>
    </div>
      <div className="programs">
        <div className='program'>
          <img src={chat} alt="" />
          <div className='caption'>
            <img src={program1} alt="" />
            <p>ChatBot</p>
          </div>
        </div>
        <div className='program'>
          <img src={video} alt="" />
          <div className='caption'>
            <img src={program2} alt="" />
            <p>Video Consultations</p>
          </div>
        </div>
        <div className='program'>
          <img src={book} alt="" />
          <div className='caption'>
            <img src={program3} alt="" />
            <p>Appointment Booking</p>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default Programs;
