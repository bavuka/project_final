import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
      {/*--------left----------*/}
      <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
        <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
          <p>For Doctors</p>
          <p className='mt-4'>Manage Your Appointments & Patients with Ease</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button 
            onClick={() => { navigate('/doctor-login'); scrollTo(0, 0); }} 
            className='bg-white text-sm sm:text-base text-gray-600 px-6 py-3 rounded-full hover:scale-105 transition-all'
          >
            Doctor Login
          </button>
          
          <button 
            onClick={() => { navigate('/doctor-signup'); scrollTo(0, 0); }} 
            className='bg-gray-100 text-sm sm:text-base text-gray-700 px-6 py-3 rounded-full hover:scale-105 transition-all'
          >
            Doctor Sign Up
          </button>
        </div>
      </div>

      {/*--------right----------*/}
      <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
        <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="Doctor Login" />
      </div>
    </div>
  );
};

export default Banner;
