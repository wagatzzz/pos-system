import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "./Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Manager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async (userId) => {
      try {
        const q = query(collection(db, "items"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const itemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
        fetchItems(user.uid);
      } else {
        setUserName("");
        setItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (itemId) => {
    navigate(`/edit-item/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, "items", itemId));
      setItems(items.filter(item => item.id !== itemId));
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={userName} />
      <div className="flex-grow bg-gray-100 p-8">
        <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6">Inventory Manager</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="border p-4 rounded bg-gray-50">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4 rounded" />
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-lg font-medium text-gray-700">KSH{parseFloat(item.price).toFixed(2)}</p>
                <p className="text-lg font-medium text-gray-700">Quantity:{parseFloat(item.quantity)}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
