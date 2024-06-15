import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FiShoppingCart, FiMenu } from "react-icons/fi";

const Navbar = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <span>WELCOME {userName}</span>
        <Link to="/manager" className="hover:text-gray-200">Inventory</Link>
        <Link to="/analysis" className="hover:text-gray-200">Analysis</Link>
        <Link to="/reports" className="hover:text-gray-200">Reports</Link>
        <Link to="/clients" className="hover:text-gray-200">Clients</Link>
        <Link to="/recommender" className="hover:text-gray-200">Recommender</Link>
      </div>
      <div className="flex items-center space-x-4">
        <FiShoppingCart 
          className="text-xl cursor-pointer hover:text-gray-200" 
          onClick={handleCartClick}
        />
        <FiMenu className="text-xl cursor-pointer hover:text-gray-200" />
        <button onClick={handleLogout} className="hover:text-gray-200">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
