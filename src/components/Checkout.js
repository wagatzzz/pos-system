import { onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, doc, runTransaction } from 'firebase/firestore';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Checkout = ({ onClose }) => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashGiven, setCashGiven] = useState('');
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === 'cash') {
      setBalance(0);
    }
  };

  const handleCashGivenChange = (e) => {
    setCashGiven(e.target.value);
    const totalPrice = getTotalPrice();
    const balance = e.target.value - totalPrice;
    setBalance(balance >= 0 ? balance : 0);
  };

  const handleCompleteCheckout = async () => {
    const totalPrice = getTotalPrice();
  
    if (!name || !number || !paymentMethod) {
      toast.error('Please fill all required fields');
      return;
    }
  
    if (paymentMethod === 'cash' && cashGiven < totalPrice) {
      toast.error('Insufficient cash given');
      return;
    }
  
    if (paymentMethod === 'mpesa') {
      pay()
      return;
    }

    const saleData = {
      customerName: name,
      customerNumber: number,
      paymentMethod,
      userId,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      timestamp: new Date(),
    };

    try {
      await runTransaction(db, async (transaction) => {
        // Ensure all reads are performed before writes
        const itemDocs = await Promise.all(cart.map(cartItem => transaction.get(doc(db, 'items', cartItem.id))));

        for (const [index, cartItem] of cart.entries()) {
          const itemDoc = itemDocs[index];

          if (!itemDoc.exists()) {
            throw new Error(`Item ${cartItem.name} does not exist in the database.`);
          }

          const newQuantity = itemDoc.data().quantity - cartItem.quantity;
          if (newQuantity < 0) {
            throw new Error(`Not enough stock for ${cartItem.name}.`);
          }

          transaction.update(doc(db, 'items', cartItem.id), { quantity: newQuantity });
        }

        const saleRef = doc(collection(db, 'sales'));
        transaction.set(saleRef, saleData);
      });

      clearCart();
      toast.success('Checkout completed successfully');
      if (onClose) {
        onClose(); // Ensure onClose is defined before calling it
      }
    } catch (error) {
      console.error('Error completing checkout:', error);
      toast.error(`Error completing checkout: ${error.message}`);
    }
  };

  function pay() {
    var url = "http://localhost:3001/initiatePayment"; // Replace with your backend server URL
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Apikey': 'Me3s8tLM8vW', // Add your API key here if required
      },
      body: JSON.stringify({
        amount: 1,
        msisdn: '0112437244',
        account_no: 200,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Assuming the response is JSON
    })
    .then(data => {
      console.log("Payment initialized successfully:", data);
      // Handle further processing or UI updates based on the response
    })
    .catch(error => {
      console.error("Error initiating payment:", error);
      // Handle errors gracefully, e.g., show error message to the user
    });
  }
  
  



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-emerald-700">Checkout</h2>
        <label className="block mb-4">
          <span className="text-sm text-gray-600">Customer Name:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border rounded mt-1 focus:outline-none focus:border-emerald-500"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-600">Customer Number:</span>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="block w-full p-2 border rounded mt-1 focus:outline-none focus:border-emerald-500"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-600">Payment Method:</span>
          <select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="block w-full p-2 border rounded mt-1 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Select</option>
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa (under development)</option>
          </select>
        </label>
        {paymentMethod === 'cash' && (
          <label className="block mb-4">
            <span className="text-sm text-gray-600">Cash Given:</span>
            <input
              type="number"
              value={cashGiven}
              onChange={handleCashGivenChange}
              className="block w-full p-2 border rounded mt-1 focus:outline-none focus:border-emerald-500"
            />
          </label>
        )}
        {paymentMethod === 'cash' && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Balance:</span> KSH {balance.toFixed(2)}
          </div>
        )}
        <div className="mb-6">
          <span className="text-sm text-gray-600">Total:</span> KSH {getTotalPrice().toFixed(2)}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCompleteCheckout}
            className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-600 focus:outline-none focus:bg-emerald-600"
          >
            Complete Checkout
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
