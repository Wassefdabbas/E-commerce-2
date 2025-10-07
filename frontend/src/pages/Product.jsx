import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShopContext from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct";
import { Star, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
const Product = () => {
  const { id } = useParams();
    const navigate = useNavigate();
  const {
    products,
    addToCart,
    isProductOnOffer,
    currency,
    favoriteItems,
    toggleFavorite,
    user,
    token,
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  useEffect(() => {
    if (products && products.length > 0) {
      const product = products.find((item) => String(item._id) === id);
      if (product) {
        setProductData(product);
        if (product.images && product.images.length > 0) {
          setImage(product.images[0]);
        }
      }
    }
  }, [id, products]);
  const handleImageClick = (newImage) => {
    setImage(newImage);
  };
  if (!productData) {
    return <div>Loading...</div>;
  }

  const isFavorite = favoriteItems.includes(id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const isLoggedIn = Boolean(user || token);
    const handleAddToCartClick = () => {
    if (!isLoggedIn) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(productData._id, size);
  };

  const isOnOffer = isProductOnOffer(productData);
  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Product images */}
        <div className="flex flex-1 gap-3">
          <div className="flex flex-col overflow-y-auto justify-start gap-3 w-[18.7%]">
            {productData.images.map((item, index) => (
              <img
                src={item}
                key={index}
                className="w-full cursor-pointer"
                alt=""
                onClick={() => handleImageClick(item)}
              />
            ))}
          </div>
          <div className="w-[81.3%]">
            <img src={image} className="w-full" alt={productData.name} />
          </div>
        </div>
        {/* Product details */}
        <div className="flex-1">
          <h2 className="font-medium text-2xl mt-2">{productData.name}</h2>
          <p className="text-gray-500 mb-4">
            {Array.isArray(productData.category)
              ? productData.category.join(", ")
              : productData.category}
          </p>
          <div className="flex items-center gap-4 mb-4">
            {isOnOffer ? (
              <>
                {/* If on offer, show offer price and original price */}
                <p className="text-2xl font-semibold text-red-500">
                  ${productData.offerPrice}
                </p>
                <p className="text-lg line-through text-gray-500">
                  ${productData.price}
                </p>
              </>
            ) : (
              <>
                {/* If not on offer, just show the regular price */}
                <p className="mt-5 text-3xl font-medium">
                  {currency}
                  {productData.price}
                </p>
              </>
            )}
          </div>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {isOnOffer &&
            productData.offerStartDate &&
            productData.offerEndDate && (
              <p className="text-xs text-gray-400 mt-5">
                {new Date(productData.offerStartDate).toLocaleDateString()} -{" "}
                {new Date(productData.offerEndDate).toLocaleDateString()}
              </p>
            )}

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.size.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 cursor-pointer ${
                    item == size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCartClick}
            className="mb-4 bg-black text-white text-sm py-3 px-8 flex gap-3 active:bg-gray-700 cursor-pointer"
          >
            ADD TO CART <ShoppingCart />
          </button>

          <button
            onClick={handleFavoriteClick}
            className="border border-blactext-sm py-3 px-5 cursor-pointer flex gap-3"
          >
            Add to Favorite{" "}
            {isFavorite ? (
              <Star className="text-yellow-400 fill-yellow-400" />
            ) : (
              <Star className="text-gray-500" />
            )}
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Easy Return iand Exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* Review
  <div className="mt-20">
    <div className="flex">
      <b className="border px-5 py-3 text-sm">Description</b>
      <p className="border px-5 py-3 text-sm">Reviews (122)</p>
    </div>

    <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
        <p></p>
        <p></p>
    </div>

  </div> */}

      {/* Related Product */}
      <RelatedProduct
        id={id}
        category={productData.category?.[0]}
        ageCategory={productData.ageCategory?.[0]}
        tags={productData.tags}
      />
    </div>
  );
};
export default Product;
