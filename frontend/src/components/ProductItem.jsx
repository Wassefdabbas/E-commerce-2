import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import ShopContext from "../context/ShopContext";
import { Star } from 'lucide-react'
import optimizeImage from "../utils/optimizeImage.js"; // <-- NEW


const ProductItem = ({
  id,
  image,
  name,
  price,
  offer,
  offerPrice,
  offerStartDate,
  offerEndDate,
}) => {
  const imgSrc = Array.isArray(image) ? image : image;
  const isOnOffer = Number(offer) > 0 && Number(offerPrice) > 0 && new Date(offerStartDate).getTime() <= Date.now() && new Date(offerEndDate).getTime() >= Date.now();
  const { favoriteItems, toggleFavorite } = useContext(ShopContext);

  const isFavorite = favoriteItems.includes(id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <Link to={`/product/${id}`} className="group block relative">
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
        {/* Top Badge */}
        <div className="absolute top-3 left-3 z-10">
            {isOnOffer && (
              <div className="bg-red-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
                {offer}% OFF
              </div>
            )}
        </div>

        <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-10 p-2 bg-white/70 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-110"
        >
          {isFavorite ? (
            <Star className="text-yellow-400 fill-yellow-400" />
          ) : (
            <Star className="text-gray-500" />
          )}
        </button>

        {/* Product Image */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src={optimizeImage(imgSrc, 400)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-900 truncate">{name}</h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            {isOnOffer ? (
              <>
                <span className="text-lg font-bold text-red-600"> ${offerPrice} </span>
                <span className="text-sm line-through text-gray-400"> ${price}</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-900"> ${price} </span>
            )}
          </div>

          {/* Optional Offer Dates (small gray text) */}
          {isOnOffer && offerStartDate && offerEndDate && (
            <p className="text-xs text-gray-400">
              {new Date(offerStartDate).toLocaleDateString()} -{" "}
              {new Date(offerEndDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
