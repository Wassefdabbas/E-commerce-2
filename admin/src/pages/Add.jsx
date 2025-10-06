import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";
import { backend_URL } from "../config/config.js";
import { CheckCircle2, Star } from "lucide-react";

const Add = () => {
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: [],
    ageCategory: "Men",
    size: [],
    tags: "",
    isActive: true,
    bestSeller: false,
    offer: "",
    offerPrice: "",
    offerStartDate: "",
    offerEndDate: "",
  });

  // useEffect to automatically calculate the offer price
  useEffect(() => {
    if (data.price > 0 && data.offer >= 0 && data.offer < 100) {
      const discount = (data.price * data.offer) / 100;
      const newOfferPrice = (data.price - discount).toFixed(2);
      setData((prevData) => ({ ...prevData, offerPrice: newOfferPrice }));
    } else {
      setData((prevData) => ({ ...prevData, offerPrice: "" }));
    }
  }, [data.price, data.offer]);

  // General handler for text inputs, selects, and simple checkboxes
  const onChangeHandler = (event) => {
    const { name, value, type, checked } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Specific handler for the size checkboxes array
  const handleSizeChange = (event) => {
    const { value, checked } = event.target;
    setData((prevData) => {
      const currentSizes = prevData.size;
      if (checked) {
        return { ...prevData, size: [...currentSizes, value] };
      } else {
        return { ...prevData, size: currentSizes.filter((s) => s !== value) };
      }
    });
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setData((prevData) => {
      const currentCats = prevData.category;
      if (checked) {
        return { ...prevData, category: [...currentCats, value] };
      } else {
        return {
          ...prevData,
          category: currentCats.filter((c) => c !== value),
        };
      }
    });
  };

  const handleRemoveImage = (index) => {
    // Revoke the object URL to free up memory
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    // Create copies of the state arrays
    const newImages = [...images];
    const newImagePreviews = [...imagePreviews];

    // Set the specific index to null
    newImages[index] = null;
    newImagePreviews[index] = null;

    // Update the state
    setImages(newImages);
    setImagePreviews(newImagePreviews);
  };

  // Handler for image file selection
  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newImagePreviews = [...imagePreviews];
      newImagePreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newImagePreviews);
    }
  };

  // Form submission handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (data.size.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }

    if (data.category.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }

    // placeholder for your real image upload logic
    const imageFiles = images.filter((img) => img !== null);
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category.join(","));
      formData.append("ageCategory", data.ageCategory);
      formData.append("isActive", data.isActive);
      formData.append("bestSeller", data.bestSeller);

      formData.append("size", data.size.join(","));
      formData.append("tags", data.tags);

      if ( data.offer ) {
        formData.append("offer", data.offer);
        formData.append("offerPrice", data.offerPrice);
        formData.append("offerStartDate", data.offerStartDate);
        formData.append("offerEndDate", data.offerEndDate);
      }

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        `${backend_URL}/api/products/`, // route is '/' in productRoutes, which maps to this
        formData,
        {
          // headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        // Reset the form to its initial state
        setData({
          name: "",
          description: "",
          price: "",
          category: [],
          ageCategory: "Men",
          size: [],
          tags: "",
          isActive: true,
          bestSeller: false,
          offer: "",
          offerPrice: "",
          offerStartDate: "",
          offerEndDate: "",
        });
        setImages([null, null, null, null]);
        setImagePreviews([null, null, null, null]);
      } else {
        toast.error(response.data.message || "Failed to add product.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-2xl space-y-4 p-3" onSubmit={onSubmitHandler}>
      <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>

      {/* Images */}
      <div>
        <p className="font-medium mb-1 text-sm">
          Upload Images (up to 4, first is main image)
          <span className="text-red-500"> *</span>
        </p>
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="relative">
              <label htmlFor={`image${index}`} className="cursor-pointer">
                <img
                  className="w-20 h-20 object-cover border-2 border-dashed rounded-md hover:border-blue-500 transition"
                  src={imagePreviews[index] || assets.upload_area}
                  alt={`Upload area ${index + 1}`}
                />
              </label>
              <input
                onChange={(e) => handleImageChange(index, e)}
                type="file"
                id={`image${index}`}
                hidden
                accept="image/*"
              />

              {/* The conditional "X" button */}
              {imagePreviews[index] && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="cursor-pointer absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition"
                  aria-label={`Remove image ${index + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <p className="font-medium mb-1 text-sm">
          Product Name <span className="text-red-500">*</span>
        </p>
        <input
          onChange={onChangeHandler}
          value={data.name}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          type="text"
          name="name"
          placeholder="e.g., Classic Cotton T-Shirt"
          required
        />
      </div>

      {/* Description */}
      <div>
        <p className="font-medium mb-1 text-sm">Product Description</p>
        <textarea
          onChange={onChangeHandler}
          value={data.description}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          name="description"
          rows="3"
          placeholder="Write a detailed description here"
        ></textarea>
      </div>

      {/* Category */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="font-medium mb-1 text-sm">
            Product Category <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 p-2 border border-gray-200 rounded-md">
            {[
              "topwear",
              "bottomwear",
              "winterwear",
              "shirt",
              "pant",
              "jacket",
            ].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer capitalize text-xs"
              >
                <input
                  type="checkbox"
                  name="category"
                  value={cat}
                  checked={data.category.includes(cat)}
                  onChange={handleCategoryChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium mb-1 text-sm">
            Age Category <span className="text-red-500">*</span>
          </p>
          <select
            onChange={onChangeHandler}
            value={data.ageCategory}
            name="ageCategory"
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Baby">Baby</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <p className="font-medium mb-1 text-sm">
            Price <span className="text-red-500">*</span>
          </p>
          <input
            onChange={onChangeHandler}
            value={data.price}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            type="number"
            name="price"
            placeholder="$20.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <p className="font-medium mb-1 text-sm">Offer Discount (%)</p>
          <input
            onChange={onChangeHandler}
            value={data.offer}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            type="number"
            name="offer"
            placeholder="e.g., 15"
            min="0"
            max="99"
          />
        </div>
        <div>
          <p className="font-medium mb-1 text-sm">Offer Price</p>
          <input
            value={data.offerPrice}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-sm"
            type="text"
            name="offerPrice"
            placeholder="Auto-calculated"
            readOnly
          />
        </div>
      </div>

      {/* offer */}
      {data.offer > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 p-3 border border-blue-200 rounded-md bg-blue-50">
          <div>
            <p className="font-medium mb-1 text-sm">
              Offer Start Date <span className="text-red-500">*</span>
            </p>
            <input
              onChange={onChangeHandler}
              value={data.offerStartDate}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              type="date"
              name="offerStartDate"
              required
            />
          </div>
          <div>
            <p className="font-medium mb-1 text-sm">
              Offer End Date <span className="text-red-500">*</span>
            </p>
            <input
              onChange={onChangeHandler}
              value={data.offerEndDate}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              type="date"
              name="offerEndDate"
              required
            />
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <p className="font-medium mb-1 text-sm">
          Available Sizes <span className="text-red-500">*</span>
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 p-2 border border-gray-200 rounded-md">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 cursor-pointer text-xs"
            >
              <input
                type="checkbox"
                name="size"
                value={size}
                checked={data.size.includes(size)}
                onChange={handleSizeChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="font-medium mb-1 text-sm">Tags (comma-separated)</p>
        <input
          onChange={onChangeHandler}
          value={data.tags}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          type="text"
          name="tags"
          placeholder="e.g., Summer, Casual, Cotton"
        />
      </div>

      {/* Active & Best Seller */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* "Product is Active" Button */}
        <button
          type="button"
          onClick={() =>
            onChangeHandler({
              target: {
                name: "isActive",
                type: "checkbox",
                checked: !data.isActive,
              },
            })
          }
          className={` flex w-full items-center justify-center gap-2 rounded-md border py-2 px-4 text-sm font-semibold transition-all duration-200 cursor-pointer
              ${
                data.isActive
                  ? "bg-green-700 text-white"
                  : "bg-transparent text-gray-600 border-gray-300 hover:bg-gray-50"
              }
           `}
        >
          <CheckCircle2 className="w-5 h-5 transition-colors" />
          Active
        </button>

        {/* "Best Seller" Button */}
        <button
          type="button"
          onClick={() =>
            onChangeHandler({
              target: {
                name: "bestSeller",
                type: "checkbox",
                checked: !data.bestSeller,
              },
            })
          }
          className={` flex w-full items-center justify-center gap-2 rounded-md border py-2 px-4 text-sm font-semibold transition-all duration-200 cursor-pointer
            ${
              data.bestSeller
                ? "bg-yellow-500 text-white"
                : "bg-transparent text-gray-600"
            }
         `}
        >
          <Star className={`w-5 h-5 transition-colors`} />
          Mark as Best Seller
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800 flex justify-center items-center transition-colors cursor-pointer"
      >
        {loading ? (
          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></span>
        ) : (
          "ADD PRODUCT"
        )}
      </button>
    </form>
  );
};

export default Add;
