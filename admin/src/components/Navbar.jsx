import React from "react";
import { assets } from "../assets/admin_assets/assets";
import {Link} from 'react-router-dom'

const Navbar = ({ handleLogout }) => {
  return (
    <div className="flex items-center py-2 px-[5%] justify-between">
      <Link to='/'>
      <img className="w-36" src={assets.logo} alt="Logo" />
      </Link>

      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:py-2 sm:px-7 rounded-full text-xs sm:text-sm cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;