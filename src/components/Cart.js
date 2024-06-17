import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import Checkout from "./Checkout";

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
    <div className="min-h-screen flex flex-col bg-gray-100 p-8">
      <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-lg">Your cart is empty</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-4">
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-lg">KSH{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <FiMinus className="w-6 h-6" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <FiPlus className="w-6 h-6" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-4">
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-xl font-semibold text-right">
              Total: KSH{getTotalPrice().toFixed(2)}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white px-6 py-3 rounded shadow-md hover:bg-blue-600"
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
