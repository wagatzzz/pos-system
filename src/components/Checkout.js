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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <label className="block mb-2">
          Customer Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Customer Number:
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="block w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Payment Method:
          <select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="block w-full p-2 border rounded mt-1"
          >
            <option value="">Select</option>
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
          </select>
        </label>
        {paymentMethod === 'cash' && (
          <label className="block mb-2">
            Cash Given:
            <input
              type="number"
              value={cashGiven}
              onChange={handleCashGivenChange}
              className="block w-full p-2 border rounded mt-1"
            />
          </label>
        )}
        {paymentMethod === 'cash' && (
          <div className="mb-2">
            Balance: KSH {balance.toFixed(2)}
          </div>
        )}
        <div className="mb-4">
          Total: KSH {getTotalPrice().toFixed(2)}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCompleteCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Complete Checkout
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;