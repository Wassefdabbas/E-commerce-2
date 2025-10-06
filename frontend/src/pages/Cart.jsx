import React, { useContext } from "react";
import ShopContext from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import { useMemo } from "react";
import {Plus, Minus} from 'lucide-react'

const Cart = () => {
  const {
    cartItems, updateQuantity, clearCart, products, currency,
    removeItemFromCart, isProductOnOffer, getTotalAmount, navigate,
  } = useContext(ShopContext);

  const cartList = useMemo(() => 
    Object.entries(cartItems).flatMap(([productId, sizes]) => {
      const product = products.find((p) => String(p._id) === productId);
      if (!product) return [];
      return Object.entries(sizes).map(([size, quantity]) => ({
        ...product, size, quantity,
      }));
  }), [cartItems, products]);

  const totalAmount = getTotalAmount();
  const shippingFee = totalAmount > 0 ? 5.00 : 0;

  if (cartList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate("/collections")}
          className="bg-gray-800 text-white px-8 py-3 hover:bg-black cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Title text1={"Shopping"} text2={"Cart"} />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="space-y-4">
              {cartList.map((item) => (
                <div key={`${item._id}_${item.size}`} className="flex items-center gap-4 p-4 bg-white shadow-sm border border-gray-200">
                  <img
                    loading="lazy"
                    src={item.images?.[0] || ''}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                    <p className="font-bold text-gray-800 mt-2">
                      {currency}
                      {isProductOnOffer(item) ? item.offerPrice.toFixed(2) : item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.size, item.quantity - 1) : null}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition text-lg cursor-pointer"
                    >
                      <Minus />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition text-lg cursor-pointer"
                    >
                      <Plus />
                    </button>
                  </div>
                  <button onClick={() => removeItemFromCart(item._id, item.size)} className="ml-4 p-2 rounded-full hover:bg-red-50 cursor-pointer">
                    <img src={assets.bin_icon} className="w-5 h-5 opacity-50 hover:opacity-100 transition" alt="Remove item" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Totals */}
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-28">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between"><p>Subtotal</p><p>{currency}{totalAmount.toFixed(2)}</p></div>
                <div className="flex justify-between"><p>Shipping Fee</p><p>{currency}{shippingFee.toFixed(2)}</p></div>
                <hr className="my-3"/>
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <p>Total</p><p>{currency}{(totalAmount + shippingFee).toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/place-order")}
                className="w-full mt-8 bg-gray-900 text-white py-3 hover:bg-black cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-3 bg-red-50 text-red-600 py-3 hover:bg-red-100 transition cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;