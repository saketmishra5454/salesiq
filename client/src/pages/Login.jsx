import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast, Toaster } from "sonner"; // ✅ import Sonner

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("username", res.data.username);

      toast.success("Login successful 🎉"); // ✅ success toast
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌"); // ✅ error toast
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster richColors position="top-center" expand={true} /> {/* ✅ Sonner toaster */}

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-red-500">
          🔐 Admin Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
