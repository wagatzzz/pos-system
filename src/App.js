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

function App() {
  return (
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
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
