import React, { useContext, useEffect, useState } from 'react'
import ShopContext from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if(location.pathname.includes('collection')){
        setVisible(true);
    }
    else{
        setVisible(false)
    }
  }, [location])

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 py-4">
      <div className="flex items-center justify-center gap-3">
        {/* Search input wrapper */}
        <div className="flex items-center w-full max-w-md border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="flex-1 outline-none bg-transparent text-sm text-gray-700"
            placeholder="Search"
          />
          <img className="w-5 opacity-70" src={assets.search_icon} alt="search" />
        </div>

        {/* Close button */}
        <button
          onClick={() => setShowSearch(false)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <img className="w-4" src={assets.cross_icon} alt="close" />
        </button>
      </div>
    </div>
  ) : null
}

export default SearchBar
