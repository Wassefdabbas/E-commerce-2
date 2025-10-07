import React, { useContext, useState } from "react";
import ShopContext from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
// import { assets } from '../assets/frontend_assets/assets';

const PlaceOrder = () => {
  const {
    getTotalAmount,
    currency,
    clearCart,
    navigate,
    // token,
    backendUrl,
    cartItems,
    setCartItems,
    products,
  } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Shipping form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    country: "",
    phone: "",
  });

  const subtotal = getTotalAmount();
  const shippingFee = subtotal > 0 ? 5.0 : 0;
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        amount: total,
        items: orderItems,
      };

      switch (paymentMethod) {
        case "cod": {
          const response = await axios.post(
            `${backendUrl}/api/orders/cod`,
             orderData,
            { withCredentials: true }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          }
          else {
            toast.error(response.data.message);
          }
          break;
        }
        // TODO: case 'stripe':
        //   await placeOrderStripe(orderData);
      }

      clearCart();
    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  };

  // Shared input classes
  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-md transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300 outline-none";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-2xl mb-8">
        <Title text1={"Checkout"} text2={"Information"} />
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-8"
      >
        {/* Left Side: Shipping Details */}
        <div className="lg:col-span-3">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Shipping Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              autoComplete="off"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClasses}
              required
            />
            <input
              autoComplete="off"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClasses}
              required
            />
            <input
              autoComplete="off"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              className={`${inputClasses} sm:col-span-2`}
              required
            />
            <input
              autoComplete="off"
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleChange}
              className={`${inputClasses} sm:col-span-2`}
              required
            />
            <input
              autoComplete="off"
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className={inputClasses}
              required
            />
            <input
              type="text"
              autoComplete="off"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className={inputClasses}
              required
            />
            <input
              autoComplete="off"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10,13}"
              className={`${inputClasses} sm:col-span-2`}
              required
            />
          </div>
        </div>

        {/* Right Side: Order Summary & Payment */}
        <div className="lg:col-span-2">
          {/* Order Summary Card */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <p>Subtotal</p>
                <p>
                  {currency}
                  {subtotal.toFixed(2)}
                </p>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-gray-700">
                <p>Shipping Fee</p>
                <p>
                  {currency}
                  {shippingFee.toFixed(2)}
                </p>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <p>Total</p>
                <p>
                  {currency}
                  {total.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white w-full font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6"
            >
              PLACE ORDER
            </button>
          </div>

          {/* Payment Method Section */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Payment Method
            </h3>
            <div className="space-y-3">
              {/* <label
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === 'stripe'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <img src={assets.stripe_logo} className="h-6" alt="Stripe" />
              </label>

              <label
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <img src={assets.razorpay_logo} className="h-6" alt="Razorpay" />
              </label> */}

              <label
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <p className="text-gray-700 font-medium">Cash On Delivery</p>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
