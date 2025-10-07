import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ShopContext from "../context/ShopContext";
import Title from "../components/Title";
import OrderStatusTracker from "../components/OrderStatusTracker"; // <-- Import new component
import { Package } from "react-feather";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  // State now holds an array of full order objects
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(
          `${backendUrl}/api/orders/userOrders`,
          {},
          { withCredentials: true }
        );
        if (response.data.success) {
          // IMPORTANT: We no longer flatten the data. We work with orders.
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [token, backendUrl]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-2">
          <Title text1={"My"} text2={"Orders"} />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading your orders...</p>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {/* Now we map over ORDERS, not items */}
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm text-gray-500">Total Amount</p>
                     <p className="text-xl font-bold text-gray-900">
                        {currency}{order.amount.toFixed(2)}
                     </p>
                  </div>
                </div>

                {/* Items within the order */}
                <div className="p-4 sm:p-6 space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <img
                        src={item.images?.[0] || ""}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <p className="text-sm text-gray-500">
                          {currency}{item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Status Tracker */}
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex justify-center sm:justify-end">
                   <OrderStatusTracker status={order.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              You haven't placed any orders yet
            </h3>
            <p className="text-gray-500">
              Discover our collection and find something you love.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;