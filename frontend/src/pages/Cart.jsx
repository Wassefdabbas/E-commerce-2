import React, { useContext } from "react";
import ShopContext from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    addToCart,
    clearCart,
    products,
    currency,
    removeItemFromCart,
    isProductOnOffer,
    getTotalAmount,
    navigate,
  } = useContext(ShopContext);

  // This logic is correct for flattening the cart data
  const cartList = Object.entries(cartItems).flatMap(([productId, sizes]) => {
    const product = products.find((p) => String(p._id) === productId);
    if (!product) return [];
    return Object.entries(sizes).map(([size, quantity]) => ({
      ...product,
      size,
      quantity,
    }));
  });

  if (!cartList.length) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-3xl font-semibold text-gray-600">
          Your Cart is Empty
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* <h2 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h2> */}
      <div className="text-2xl mb-3">
        <Title text1={"Shopping"} text2={"Cart"} />
      </div>

      <div className="space-y-6">
        {cartList.map((item) => (
          <div
            key={`${item._id}_${item.size}`}
            className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                loading="lazy"
                src={Array.isArray(item.images) ? item.images[0] : item.images}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-lg">{item.name}</p>
                <div className="flex items-center gap-5 mt-2">
                  <p className="text-gray-700">
                    {currency}
                    {isProductOnOffer(item) ? item.offerPrice : item.price}
                  </p>
                  <p className="px-2 sm:px-3 sm:py-1 border bg-slate-100">
                    {item.size}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <button
                onClick={() => removeFromCart(item._id, item.size)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
              >
                -
              </button>
              <span className="px-3 py-1 border rounded">{item.quantity}</span>
              <button
                onClick={() => addToCart(item._id, item.size)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
              >
                +
              </button>
            </div>

            <img
              onClick={() => removeItemFromCart(item._id, item.size)}
              src={assets.bin_icon}
              className="w-4 mr-4 sm:w-5 cursor-pointer"
              alt=""
            />
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-between items-start gap-8">
        {/* Left Side: Cart Total */}
        <div className="w-full sm:w-1/2">
          <h3 className="text-2xl font-semibold mb-4">Cart Totals</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <p>Subtotal</p>
              <p>
                {currency}
                {getTotalAmount().toFixed(2)}
              </p>
            </div>
            <hr />
            <div className="flex justify-between text-gray-600">
              <p>Shipping Fee</p>
              <p>{currency}5.00</p> {/* Example flat shipping fee */}
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>
                {currency}
                {(getTotalAmount() + 5).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="w-full sm:w-auto flex flex-col gap-4">
          <button
            onClick={() => navigate("/place-order")}
            className="bg-black text-white w-full px-8 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            PROCEED TO CHECKOUT
          </button>
          <button
            onClick={clearCart}
            className="bg-red-600 text-white w-full px-8 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
