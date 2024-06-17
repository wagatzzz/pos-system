import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemDoc = await getDoc(doc(db, "items", itemId));
        if (itemDoc.exists()) {
          setItem(itemDoc.data());
        } else {
          console.error("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching item: ", error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle conversion to number for price and quantity fields
    const updatedValue = name === 'price' || name === 'quantity' ? parseFloat(value) : value;

    setItem(prevState => ({
      ...prevState,
      [name]: updatedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "items", itemId), item);
      toast.success("Item updated successfully!");
      navigate("/manager");
    } catch (error) {
      console.error("Error updating item: ", error);
      toast.error("Error updating item.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>Item not found</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Edit Item</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded shadow-md hover:bg-blue-600"
          >
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
