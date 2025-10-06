import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import {Link} from 'react-router-dom'
const Footer = () => {
  return (
    <div>
      <div className='grid gap-14 my-10 mt-40 text-sm sm:grid-cols-[3fr_1fr_1fr]'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="Company logo" />
            <p className='w-full md:w-2/3 text-gray-600'>
              Discover quality apparel for everyone. We curate the latest styles with an eye for comfort, durability, and value. Shop with confidence and enjoy fast delivery and easy returns.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>
                Company
            </p>

            <ul className='flex flex-col gap-2 text-gray-600'>
                <li className='cursor-pointer hover:text-black transition-colors'> <Link to={'/'} > Home </Link> </li>
                 <li className='cursor-pointer hover:text-black transition-colors'> <Link to={'/about'} > About us </Link></li> 
                 <li className='cursor-pointer hover:text-black transition-colors'> <Link to={'/contact'} >Privacy Policy </Link></li> 
                {/* <li className='cursor-pointer hover:text-black transition-colors'>Terms & Conditions</li> */}
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>
                Get In Touch
            </p>

            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>
                  <span className='text-gray-500'>Email: </span>
                  <a href='mailto:support@shop.co' className='hover:text-black transition-colors'>support@shop.co</a>
                </li>
                <li>
                  <span className='text-gray-500'>Phone: </span>
                  <a href='tel:+10000000000' className='hover:text-black transition-colors'>+1 000 000 0000</a>
                </li>
                <li>
                  <span className='text-gray-500'>Address: </span>
                  <span>123 Fashion Ave, New York, NY</span>
                </li>
                <li>
                  <span className='text-gray-500'>Hours: </span>
                  <span>Mon–Fri, 9:00 AM – 6:00 PM</span>
                </li>
            </ul>
        </div>

      </div>

      <div className='text-sm text-gray-600'>
        <hr />
        <div className='py-5 flex justify-center items-center'>
          <p>© {new Date().getFullYear()} Shop.co. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
