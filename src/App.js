import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ItemForm from "./components/ItemForm";
import ItemList from "./components/ItemList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Manager from "./components/Manager";
import EditItem from "./components/EditItem";
import SalesAnalysis from './components/SalesAnalysis';
import SalesByDate from './components/SalesByDate';


function App() {
  return (
    <div className="bg-white min-h-screen">
      <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-item" element={<ItemForm />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/edit-item/:itemId" element={<EditItem />} />
          <Route path="/sales-analysis" element={<SalesAnalysis />} />
          <Route path="/sales-by-date" element={<SalesByDate />} />
          
        </Routes>
      </Router>
    </CartProvider>
    </div>
    
  );
}

export default App;
