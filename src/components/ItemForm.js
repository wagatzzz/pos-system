import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const ItemForm = () => {
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [barcode, setBarcode] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "items"), {
        image,
        category,
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        barcode,
        userId,
      });
      navigate("/items");
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Add Item</h1>
        <form onSubmit={handleAddItem}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-3 border rounded bg-gray-100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="w-full p-3 border rounded bg-gray-100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Barcode</label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
