import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchItem, updateItem } from "../services/firebaseServices";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const itemData = await fetchItem(itemId);
        setItem(itemData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching item: ", error);
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'price' || name === 'quantity' ? parseFloat(value) : value;

    setItem(prevState => ({
      ...prevState,
      [name]: updatedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItem(itemId, item);
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
        <h1 className="text-2xl font-bold mb-6 text-emerald-700">Edit Item</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              className="w-full p-3 border hover:border-black rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              className="w-full p-3 border hover:border-black rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleChange}
              className="w-full p-3 border hover:border-black rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-900 text-white p-3 rounded shadow-md"
          >
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
