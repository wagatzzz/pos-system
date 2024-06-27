import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";


const Navbar = ({ userName }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-emerald-700 text-white p-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-4">
        <span className="text-4xl font-extrabold uppercase tracking-wide text-lime-600 drop-shadow-md">
          WELCOME {userName}
        </span>

      </div>
      <div className="flex-grow flex justify-center">
        <div className="hidden md:flex space-x-4">
          <Link to="/items" className="hover:text-gray-200">Shop</Link>
          <Link to="/manager" className="hover:text-gray-200">Inventory</Link>
          <Link to="/sales-analysis" className="hover:text-gray-200">Analysis</Link>
          <Link to="/sales-by-date" className="hover:text-gray-200">Reports</Link>
          <Link to="/recommender" className="hover:text-gray-200">Recommender</Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <FiShoppingCart
          className="text-xl cursor-pointer hover:text-gray-200"
          onClick={handleCartClick}
        />
        <div className="md:hidden">
          <FiMenu className="text-xl cursor-pointer hover:text-gray-200" onClick={toggleNavbar} />
        </div>
        <button onClick={handleLogout} className="hidden md:inline hover:text-gray-200">Logout</button>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-0 left-0 w-full bg-emerald-700 text-white flex flex-col items-center space-y-4 py-6 ${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <FiX className="text-xl cursor-pointer hover:text-gray-200 self-end mr-4" onClick={toggleNavbar} />
        <Link to="/items" className="hover:text-gray-200" onClick={toggleNavbar}>Shop</Link>
        <Link to="/manager" className="hover:text-gray-200" onClick={toggleNavbar}>Inventory</Link>
        <Link to="/sales-analysis" className="hover:text-gray-200" onClick={toggleNavbar}>Analysis</Link>
        <Link to="/sales-by-date" className="hover:text-gray-200" onClick={toggleNavbar}>Reports</Link>
        <Link to="/clients" className="hover:text-gray-200" onClick={toggleNavbar}>Clients</Link>
        <Link to="/recommender" className="hover:text-gray-200" onClick={toggleNavbar}>Recommender</Link>
        <button onClick={handleLogout} className="hover:text-gray-200">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
