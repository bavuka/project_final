import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*------------left--------- */}
            <div>
                   <img className='mb-5 w-40' src={assets.logo} alt="" />
                   <p className='w-full md:w-2/3 text-gray-600 leading-6 '>Find the right doctor, fast and hassle-free, with AI-powered precision! Get personalized specialist recommendations, nearby hospitals and instant appointment booking all in one place.</p>
            </div>
            
            {/*------------center--------- */}
            <div>
                {/*<p className='text-xl font-medium mb-5'>COMPANY</p>8*/}
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                </ul>
                
            </div>
            
            {/*------------right--------- */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91-984-756-7890</li>
                    <li>aidocfinder@gmail.com</li>
                </ul>
            </div>

            
        </div>
    </div>
  )
}

export default Footer