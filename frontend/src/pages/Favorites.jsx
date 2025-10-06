import React, { useContext, useEffect, useState } from "react";
import ShopContext from "../context/ShopContext";
import ProductItem from "../components/ProductItem";

const Favorites = () => {
  const { products, activeFavoriteIds } = useContext(ShopContext);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      // Filter the main product list to get full data for favorited items
      const favorited = products.filter((product) =>
        activeFavoriteIds.includes(product._id)
      );
      setWishlistProducts(favorited);
    } else {
      setWishlistProducts([]);
    }
  }, [products, activeFavoriteIds]);

  return (
    <div className="py-20 px-4 sm:px-10 lg:px-20 bg-[#FDFDFD] min-h-screen">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1
          className="text-4xl md:text-5xl text-[#333]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          My Wishlist
        </h1>
        <p className="text-gray-500 mt-2">
          Your personal collection of curated pieces.
        </p>
      </div>

      {/* Wishlist Product Grid */}
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {wishlistProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.images?.[0]}
              name={item.name}
              price={item.price}
              offer={item.offer}
              offerPrice={item.offerPrice}
            />
          ))}
        </div>
      ) : (
        // Message to show when the wishlist is empty
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
          <p className="text-gray-400 mt-2">
            Click the heart icon on any product to save it for later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
