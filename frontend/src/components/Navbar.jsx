// src/components/Navbar.js

import React, { useContext, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { NavLink, Link, useLocation } from "react-router-dom";
import ShopContext from "../context/ShopContext";
import {Star} from 'lucide-react'

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, activeFavoriteIds, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
  const location = useLocation();
  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <NavLink to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </NavLink>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collections" className="flex flex-col items-center gap-1">
          <p>Collections</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        {/* <NavLink to="/offers" className="flex flex-col items-center gap-1">
          <p>Offers</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />

        </NavLink> */}
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
      {location.pathname.includes('collection') && (
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />)}

        <div className="group relative">
          {/* <Link to='login'> */}
            <img
              onClick={() => token ? null : navigate('/login')}
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt=""
            />
          {/* Dropdown */}
          {token && 
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p onClick={() => navigate('/favorites')} className="cursor-pointer hover:text-black">My Profile</p>
              <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div> }
        </div>
        <Link to="/cart">
          <div className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </div>
        </Link>
        <Link to="/favorites" className="relative">
          <Star />
          {activeFavoriteIds.length > 0 && (
            <p className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[10px]">
              {activeFavoriteIds.length}
            </p>
          )}
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar for samll screen */}

<div
  className={`fixed top-0 right-0 bottom-0 bg-white z-50 overflow-hidden transition-all duration-300 ${
    visible ? "w-3/4 sm:w-1/2" : "w-0"
  }`}
>
  <div className="flex flex-col h-full text-gray-600">
    {/* Close button */}
    <div
      onClick={() => setVisible(false)}
      className="flex items-center gap-4 p-4 cursor-pointer"
    >
      <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
      <p className="font-medium">Back</p>
    </div>

    {/* Navigation links */}
    <nav className="flex flex-col mt-4">
      <NavLink
        onClick={() => setVisible(false)}
        className="py-3 pl-6 border-t hover:bg-gray-100"
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        onClick={() => setVisible(false)}
        className="py-3 pl-6 border-t hover:bg-gray-100"
        to="/collections"
      >
        Collections
      </NavLink>
      <NavLink
        onClick={() => setVisible(false)}
        className="py-3 pl-6 border-t hover:bg-gray-100"
        to="/about"
      >
        About
      </NavLink>
      <NavLink
        onClick={() => setVisible(false)}
        className="py-3 pl-6 border-t hover:bg-gray-100"
        to="/contact"
      >
        Contact
      </NavLink>
    </nav>

    {/* Profile / Logout section at bottom */}
    {token && (
      <div className="mt-auto py-6 px-6 border-t flex flex-col gap-3 text-gray-700">
        <p
          onClick={() => { setVisible(false); navigate("/favorites"); }}
          className="cursor-pointer hover:text-black hover:font-medium"
        >
          My Profile
        </p>
        <p
          onClick={() => { navigate("/orders"); setVisible(false); }}
          className="cursor-pointer hover:text-black hover:font-medium"
        >
          Orders
        </p>
        <p
          onClick={() => { logout(); setVisible(false); }}
          className="cursor-pointer hover:text-black hover:font-medium"
        >
          Logout
        </p>
      </div>
    )}
  </div>
</div>

    </div>
  );
};
export default Navbar;