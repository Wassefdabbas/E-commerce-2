import React, { useState } from "react";
// import { products as productsData } from "../assets/frontend_assets/assets";
import ShopContext from "./ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useEffect } from "react";
import { useMemo } from "react";

// const normalizeProduct = (p) => {
//   const ageCategory = p.ageCategory || p.category;
//   const derivedCategory =
//     p.category && !p.subCategory
//       ? p.category
//       : (p.subCategory || "").toLowerCase();
//   return {
//     ...p,
//     ageCategory,
//     category: derivedCategory || p.category || "",
//     isActive: typeof p.isActive === "boolean" ? p.isActive : true,
//   };
// };

const FAVORITES_KEY = import.meta.env.VITE_FAVORITES_KEY

const isProductOnOffer = (p) => {
  if (!p) return false;
  const hasValidPrice = p.offerPrice != null && Number(p.offerPrice) > 0;
  if (!hasValidPrice) return false;
  const now = new Date();
  const startOk = !p.offerStartDate || new Date(p.offerStartDate) <= now;
  const endOk = !p.offerEndDate || new Date(p.offerEndDate) >= now;
  return startOk && endOk;
};

const ShopContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [products, setProducts] = useState([])

  // const [products] = useState(() => (productsData || []).map(normalizeProduct));
  const [cartItems, setCartItems] = useState({});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [favoriteItems, setFavoriteItems] = useState([]);

  const navigate = useNavigate()

  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error('Please select a product size');
      return;
    }
    setCartItems((prev) => {
      const newCart = structuredClone(prev);
      if (!newCart[itemId]) {
        newCart[itemId] = {};
      }
      newCart[itemId][size] = (newCart[itemId][size] || 0) + 1;
      return newCart;
    });
  };

  const removeFromCart = (itemId, size) => {
    setCartItems((prev) => {
      const newCart = structuredClone(prev);

      if (newCart[itemId] && newCart[itemId][size] > 1) {
        newCart[itemId][size] -= 1;
      }
      return newCart;
    });
  };

  const removeItemFromCart = (itemId, size) => {
    setCartItems((prev) => {
      const newCart = structuredClone(prev);
      // Check if the product and size exist
      if (newCart[itemId] && newCart[itemId][size]) {
        // Delete the size entry for that product
        delete newCart[itemId][size];
        // If the product now has no sizes, delete the product entry itself
        if (Object.keys(newCart[itemId]).length === 0) {
          delete newCart[itemId];
        }
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  const getTotalAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        const product = products.find((p) => String(p._id) === itemId);
        if (product) {
          const price = isProductOnOffer(product) ? product.offerPrice : product.price;
          totalAmount += price * quantity;
        }
      }
    }
    return totalAmount;
  };


  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products`)
      if(response.data.success){
        setProducts(response.data.products)
      }
      else {
        toast.error(response.data.message)
      }
    } catch(error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getProductData()
  }, [])

  // Favorites from LocalStorage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavoriteItems(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage:", error);
      setFavoriteItems([]);
    }
  }, []);

  const toggleFavorite = (productId) => {
    let updatedFavorites;
    const isFavorite = favoriteItems.includes(productId);

    if (isFavorite) {
      updatedFavorites = favoriteItems.filter(id => id !== productId);
    } else {
      updatedFavorites = [...favoriteItems, productId];
    }

    setFavoriteItems(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const activeFavoriteIds = useMemo(() => {
    // First, create a fast-lookup Set of all active product IDs
    const activeProductIds = new Set(
      products.filter(p => p.isActive).map(p => p._id)
    );
    // Then, filter the user's "master list" of favorites.
    // Only keep a favorite if its ID exists in the activeProductIds Set.
    return favoriteItems.filter(id => activeProductIds.has(id));

  }, [products, favoriteItems]);
  const value = {
    products,
    cartItems,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getTotalAmount,
    removeItemFromCart,
    isProductOnOffer,
    currency: "$",
    navigate,
    backendUrl,
    favoriteItems,
    toggleFavorite,
    activeFavoriteIds
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;