import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import Checkout from "../components/Checkout";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-emerald-700">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-lg text-gray-800">Your cart is empty</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-4">
                  <div>
                    <h2 className="text-xl font-semibold text-emerald-600 uppercase">{item.name}</h2>
                    <p className="text-lg text-gray-700">KSH {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <FiMinus className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                    <span className="mx-2 text-lg">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <FiPlus className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-4">
                      <FiX className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-xl font-semibold text-right text-emerald-700">
              Total: KSH {getTotalPrice().toFixed(2)}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleCheckout}
                className="bg-emerald-700 text-white px-6 py-3 rounded-md shadow-md hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
      {showCheckout && <Checkout onClose={handleCloseCheckout} />}
    </div>
  );
};

export default Cart;
