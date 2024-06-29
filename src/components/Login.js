import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/items"); // Redirect to add-item page after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-emerald-700">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-500">You can Login with the following to see an already active account or make your own account from scratch:</p>
            <p className="text-sm italic text-gray-500">email: peter@gmail.com</p>
            <p className="text-sm italic text-gray-500">password: 123456</p>


            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-3 border hover:border-black rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-3 border  hover:border-black rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-900 text-white p-3 rounded">Login</button>
        </form>
        <p className="text-sm text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-emerald-700 hover:text-emerald-950">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
