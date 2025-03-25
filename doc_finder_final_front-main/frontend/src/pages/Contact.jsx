import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500 '>
          <p> <span className='text-gray-700 font-semibold'> CONTACT US</span> </p>
        </div>

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
          <img src={assets.contact_image} alt="" />
          <div className='flex flex-col justify-center items-start  gap-6'>
            <p className='font-semibold text-lg text-gray-600'>OUR TEAM</p>
            <p className='text-gray-500'>EMAIL:aidocfinder@gmail.com</p>
            <p className='text-gray-500'>TEL:+91-984-756-7890 </p>
           
            <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>EXPLORE NOW</button>
          </div>
        </div>
    </div>
  )
}

export default Contact