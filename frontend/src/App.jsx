import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Footer from "./components/Footer";
// import Offers from './pages/Offers'
import SearchBar from "./components/SearchBar";
import Cart from './pages/Cart'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";

const App = () => {
  return (
    <div className="px-4 sm:px-[Svw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<Product />} />

        {/* <Route path='/offers' element={<Offers />}/> */}
        <Route path='/cart' element={<Cart />}/>
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
