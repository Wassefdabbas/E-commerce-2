import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backend_URL } from "../config/config.js";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(
        `${backend_URL}/api/products/admin/all`,
        { withCredentials: true }
      );
      if (response.data.products) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error fetching product list."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      const response = await axios.patch(
        `${backend_URL}/api/products/${id}/status`,
        { isActive: !currentStatus },
        { withCredentials: true }
      );

      if (response.data.success && response.data.product) {
        const updatedProduct = response.data.product;
        // Update the list state immutably
        setList((prevList) =>
          prevList.map((p) => (p._id === id ? updatedProduct : p))
        );
        toast.success("Status updated successfully!");
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null); // Stop the spinner
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse text-lg">
          Loading products...
        </p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          No Products Found
        </h3>
        <p className="text-gray-500 mt-2">
          Try adding a new product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">All Products List</div>

      {/* 4. RESPONSIVE LAYOUT: The main change is here */}
      {/* Desktop View: Table */}
      <div className="hidden md:block shadow-lg rounded-xl">
        <table className="w-full text-sm text-left border-collapse bg-white">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Offer</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-5 py-3 font-medium text-gray-800">
                  {product.name}
                </td>
                <td className="px-5 py-3">
                  {(product.offerPrice && product.offerStartDate <= Date.now() && product.offerEndDate >= Date.now()) ? (
                    <div className="flex flex-col">
                      <span className="text-red-500 font-semibold">
                        ${product.offerPrice.toFixed(2)}
                      </span>
                      <span className="text-xs line-through text-gray-400">
                        ${product.price}
                      </span>
                    </div>
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td className="px-5 py-3 text-gray-600 capitalize">
                  {Array.isArray(product.category)
                    ? product.category.join(", ")
                    : product.category}
                </td>
                <td className="px-5 py-3">
                  {product.offer ? (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                      {product.offer}%
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    onClick={() => toggleActive(product._id, product.isActive)}
                    disabled={updatingId === product._id}
                    className={`w-24 h-8 flex items-center justify-center rounded-full text-xs font-medium transition cursor-pointer ${
                      updatingId === product._id
                        ? "bg-gray-200 text-gray-500"
                        : product.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {updatingId === product._id ? (
                      <Spinner />
                    ) : product.isActive ? (
                      "Active"
                    ) : (
                      "Inactive"
                    )}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/edit/${product._id}`)}
                    className="w-24 h-8 flex mr-5 items-center justify-center rounded-full text-xs font-medium transition bg-blue-300 cursor-pointer"
                  >
                    {" "}
                    Edit{" "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow-md space-y-3"
          >
            <div className="flex gap-4">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {Array.isArray(product.category)
                    ? product.category.join(", ")
                    : product.category}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-700">
                {product.offerPrice ? (
                  <div className="flex flex-col">
                    <span className="text-red-500 font-semibold">
                      ${product.offerPrice.toFixed(2)}
                    </span>
                    <span className="text-xs line-through text-gray-400">
                      ${product.price}
                    </span>
                  </div>
                ) : (
                  `$${product.price}`
                )}
              </div>
              <div className="text-gray-600">
                {product.offer ? (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                    {product.offer}%
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => toggleActive(product._id, product.isActive)}
                disabled={updatingId === product._id}
                className={`w-full h-9 flex items-center justify-center rounded-md text-sm font-medium transition ${
                  updatingId === product._id
                    ? "bg-gray-200 text-gray-500"
                    : product.isActive
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {updatingId === product._id ? (
                  <Spinner />
                ) : product.isActive ? (
                  "Status: Active"
                ) : (
                  "Status: Inactive"
                )}
              </button>
              <button
                onClick={() => navigate(`/edit/${product._id}`)}
                className="w-full h-9 mt-2 flex items-center justify-center rounded-md text-sm font-medium transition bg-blue-300 cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. A simple spinner component to use in the button
const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default List;

{
  /* <td className="px-4 py-3 text-gray-700">

</td>


<td className="px-4 py-3 text-gray-600">

</td> */
}
