import { useState } from "react";
import ShopContext from "./ShopContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useMemo } from "react";

const FAVORITES_KEY = import.meta.env.VITE_FAVORITES_KEY;

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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState({});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [favoriteItems, setFavoriteItems] = useState([]);
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  // Add to Cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.info("Please select a product size");
      return;
    }

    setCartItems((prev) => {
      const newCart = structuredClone(prev);
      if (!newCart[itemId]) newCart[itemId] = {};
      newCart[itemId][size] = (newCart[itemId][size] || 0) + 1;
      return newCart;
    });

    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/addToCart`,
        { itemId, size },
        { withCredentials: true }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData); // sync with backend cart
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Update Quantity
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/updateCart`,
          { itemId, size, quantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const removeItemFromCart = async (itemId, size) => {
    setCartItems((prev) => {
      const newCart = structuredClone(prev);
      if (newCart[itemId] && newCart[itemId][size]) {
        delete newCart[itemId][size];
        if (Object.keys(newCart[itemId]).length === 0) delete newCart[itemId];
      }
      return newCart;
    });

    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/removeItem`,
        { itemId, size },
        { withCredentials: true }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const clearCart = async () => {
    setCartItems({});

    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/clearCart`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
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
          const price = isProductOnOffer(product)
            ? product.offerPrice
            : product.price;
          totalAmount += price * quantity;
        }
      }
    }
    return totalAmount;
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/products`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/cart/getCart`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart();
    }
  }, []);

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
      updatedFavorites = favoriteItems.filter((id) => id !== productId);
    } else {
      updatedFavorites = [...favoriteItems, productId];
    }

    setFavoriteItems(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const activeFavoriteIds = useMemo(() => {
    // First, create a fast-lookup Set of all active product IDs
    const activeProductIds = new Set(
      products.filter((p) => p.isActive).map((p) => p._id)
    );
    // Then, filter the user's "master list" of favorites.
    // Only keep a favorite if its ID exists in the activeProductIds Set.
    return favoriteItems.filter((id) => activeProductIds.has(id));
  }, [products, favoriteItems]);

  const value = {
    products,
    cartItems,
    setCartItems,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    updateQuantity,
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
    activeFavoriteIds,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
