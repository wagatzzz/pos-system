import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "./Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
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

  const handleAddToCart = (item) => {
    if (item.quantity <= 0) {
      toast.error(`${item.name} is not available in stock!`);
    } else {
      addToCart(item);
      toast.success(`${item.name} added to cart!`);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery)
  );

  const handleAddItem = () => {
    navigate("/add-item");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={userName} />
      <div className="flex-grow bg-gray-100 p-8">
        <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6">Items List</h1>
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full p-3 border rounded"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button
              onClick={handleAddItem}
              className="ml-4 bg-blue-500 text-white p-3 rounded shadow-md hover:bg-blue-600 flex items-center"
            >
              <FiPlus />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="border p-4 rounded bg-gray-50 cursor-pointer"
                onClick={() => handleAddToCart(item)}
              >
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4 rounded" />
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-lg font-medium text-gray-700">KSH{parseFloat(item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
