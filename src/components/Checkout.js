import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashGiven, setCashGiven] = useState("");
  const [balance, setBalance] = useState(0);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === "cash") {
      setBalance(0);
    }
  };

  const handleCashGivenChange = (e) => {
    const cash = parseFloat(e.target.value);
    const total = getTotalPrice();
    setCashGiven(cash);
    setBalance(cash - total);
  };

  const handleCompleteCheckout = async () => {
    try {
      // Save the sale to the database
      const saleRef = await addDoc(collection(db, "sales"), {
        customerName,
        customerNumber,
        paymentMethod,
        items: cart,
        total: getTotalPrice(),
        date: new Date(),
      });

      // Update the item quantities in the database
      for (const cartItem of cart) {
        const itemRef = doc(db, "items", cartItem.id);
        await updateDoc(itemRef, {
          quantity: cartItem.quantity - 1,
        });
      }

      // Clear the cart
      clearCart();
      alert("Checkout completed successfully!");
    } catch (error) {
      console.error("Error completing checkout: ", error);
      alert("Error completing checkout. Please try again.");
    }
  };

  return (
    <div className="bg-gray-200 p-6 rounded shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Customer Number</label>
        <input
          type="text"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
          className="w-full p-3 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <div className="flex items-center space-x-4">
          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={handlePaymentMethodChange}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              value="mpesa"
              checked={paymentMethod === "mpesa"}
              onChange={handlePaymentMethodChange}
            />
            Mpesa
          </label>
        </div>
      </div>
      {paymentMethod === "cash" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Cash Given</label>
          <input
            type="number"
            value={cashGiven}
            onChange={handleCashGivenChange}
            className="w-full p-3 border rounded"
          />
          <div className="mt-2 text-lg">
            Balance: KSH{balance.toFixed(2)}
          </div>
        </div>
      )}
      <div className="mt-6 text-right">
        <button
          onClick={handleCompleteCheckout}
          className="bg-green-500 text-white px-6 py-3 rounded shadow-md hover:bg-green-600"
        >
          Complete Checkout
        </button>
      </div>
    </div>
  );
};

export default Checkout;
