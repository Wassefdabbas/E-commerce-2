import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Edit from "./pages/Edit";
import Home from "./pages/Home";
import Login from "./components/Login";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { backend_URL } from './config/config';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]); // --- NEW: State for products
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(backend_URL + "/api/products/admin/all", { withCredentials: true });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await axios.get(backend_URL + "/api/auth/me", { withCredentials: true });
        setIsLoggedIn(true);
        fetchProducts();
      } catch (error) {
        console.log(error)
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(backend_URL + "/api/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      setProducts([]); // Clear products on logout
      navigate("/"); // Navigate to login page
    } catch (error) {
      console.error("Logout API call failed:", error);
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {!isLoggedIn ? (
        // Pass a function that also fetches products after setting login state
        <Login setIsLoggedIn={() => {
          setIsLoggedIn(true);
          fetchProducts();
        }} />
      ) : (
        <>
          <Navbar handleLogout={handleLogout} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                {/* --- THIS IS THE FIX FOR REQUEST #2 --- */}
                <Route path="/" element={<Home productCount={products.length} />} />
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/edit/:id" element={<Edit />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;