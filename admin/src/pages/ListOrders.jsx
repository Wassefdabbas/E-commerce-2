import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_URL } from "../config/config.js";
import { Package, User, MapPin, CreditCard, Calendar } from "react-feather";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 text-white";
    case "processing":
      return "bg-blue-500 text-white";
    case "shipped":
      return "bg-purple-500 text-white";
    case "delivered":
      return "bg-green-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <Package className="w-4 h-4" />;
    case "processing":
      return <User className="w-4 h-4" />;
    case "shipped":
      return <MapPin className="w-4 h-4" />;
    case "delivered":
      return <Calendar className="w-4 h-4" />;
    case "cancelled":
      return <CreditCard className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backend_URL}/api/orders/list`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        setError("Failed to load orders");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const res = await axios.post(
        `${backend_URL}/api/orders/status`,
        { orderId, status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        setError("Failed to update status");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setUpdatingOrder(null);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 text-red-700 p-3 rounded-lg">
        {error}
        <button
          onClick={loadOrders}
          className="ml-4 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No Orders</h3>
          <p className="text-gray-500">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {order.address?.firstName || "Unknown"} {order.address?.lastName || "User"}
                  </h4>
                  <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-800">${order.amount}</p>
                  <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img
                      src={item.images?.[0] || "../assets/images/placeholder.png"}
                      className="w-12 h-12 object-cover rounded"
                      alt={item.name}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ${item.price} × {item.quantity} | Size: {item.size || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{order.address?.street || "N/A"}, {order.address?.city || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="capitalize">
                    {order.paymentMethod}{order.paymentMethod === "cod" && order.payment ? " (Paid)" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(order.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex justify-between items-center">
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status || "pending")}
                  {order.status || "Pending"}
                </span>
                <div className="flex gap-2">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map(
                    (status) =>
                      order.status !== status && (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order._id, status)}
                          disabled={updatingOrder === order._id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;