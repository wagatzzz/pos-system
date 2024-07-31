import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addItem, observeAuthState } from "../services/firebaseServices";

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
    const unsubscribe = observeAuthState(setUserId);
    return () => unsubscribe();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addItem({
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
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-6 mb-6">
        <h1 className="text-2xl font-bold mb-6 text-emerald-700">Add Item</h1>
        <form onSubmit={handleAddItem}>
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-500">
              Please use the following placeholder for image URL since I have not yet worked on adding an image:
            </p>
            <p className="mb-4 text-sm italic text-gray-500">https://placehold.co/150x150/png</p>
            <label className="block mb-2 text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              className="w-full p-3 border hover:border-black rounded"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              className="w-full p-3 border hover:border-black rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-3 border hover:border-black rounded"
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
              className="w-full p-3 border hover:border-black rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="w-full p-3 border hover:border-black rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Barcode</label>
            <input
              type="text"
              className="w-full p-3 border hover:border-black rounded"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-900 text-white p-3 rounded">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
