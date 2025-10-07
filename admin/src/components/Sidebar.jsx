import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-gray-400 border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
      <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 px-3 rounded-l' to="/add">
        <img src={assets.add_icon} className="w-5 h-5" alt="" />
        <p className="hidden md:block">Add Items</p>
      </NavLink>

      <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 px-3 rounded-l' to="/list">
        <img src={assets.parcel_icon} className="w-5 h-5" alt="" />
        <p className="hidden md:block">List Items</p>
      </NavLink>

      <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 px-3 rounded-l' to="/listOrders">
        <img src={assets.order_icon} className="w-5 h-5" alt="" />
        <p className="hidden md:block">Orders</p>
      </NavLink>

      {/* TODO AI gen image */}
      {/* <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 py-2 px-3 rounded-l' to="/orders">
        <img src={assets.order_icon} className="w-5 h-5" alt="" />
        <p className="hidden md:block">Orders</p>
      </NavLink> */}
      </div>
    </div>
  );
};

export default Sidebar;
