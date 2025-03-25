import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div>
      <div>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="About Us" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to AI Doc Finder, your intelligent healthcare assistant! Our AI-powered platform helps you quickly find the right specialist based on your symptoms, making medical care access seamless and hassle-free.</p>
          <p>We streamline specialist selection, centralize patient information, and enable easy booking. With AI-driven recommendations and online consultations, users can access medical care faster and more efficiently.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>To revolutionize healthcare accessibility by leveraging AI to connect patients with the right specialists, streamline appointments, and ensure timely, personalized medical care for everyone, everywhere.</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
      </div>


 
      <div className='flex flex-col md:flex-row mb-20'>
        
      
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Efficiency</b>
        <p>Streamlined appointment scheduling that fits into your busy lifestyle</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary  hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Convenience </b>
        <p>Access to a network of trusted healthcare professionals</p>
      </div>
      <div className= 'border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary  hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Personalization:</b>
        <p>Tailored recommendations and remainders to help you stay on top of your health </p>
      </div>
    </div>
    </div>
  );
};

export default About;
