import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import React from "react";
import { toast, Toaster } from "sonner";
import { UserPlus, User, Lock, ShoppingCart } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username and password are required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        username,
        password,
      });

      toast.success("Registration successful ✅ Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message ||
          "Registration failed ❌ Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-24 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 overflow-auto">

      <Toaster richColors position="top-center" expand={true} />

      <form
        onSubmit={handleRegister}
        className="relative z-20 bg-white/10 backdrop-filter backdrop-blur-xl rounded-3xl p-10 w-full max-w-sm mx-4 
                   shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-transparent 
                   hover:border-green-400 hover:shadow-[0_12px_40px_rgba(16,185,129,0.4)] 
                   transition-all duration-500 transform hover:-translate-y-1"
      >
        <div className="flex flex-col items-center justify-center mb-5">
          <ShoppingCart
            size={52}
            className="text-green-400 drop-shadow-lg animate-bounce-subtle"
          />
          <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-500">
            SalesIQ
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mt-1 animate-pulse"></div>
          <p className="text-gray-300 text-base mt-4 font-light text-center">
            A Powerful Sales Management System
          </p>
        </div>

        <p className="text-gray-200 text-xl font-bold mb-5 text-center">
          Register Now
        </p>

        <div className="relative mb-4">
          <User
            size={22}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-400"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/15 text-white placeholder-gray-300 rounded-xl 
                       border border-transparent focus:border-green-400 focus:ring-2 focus:ring-green-400 
                       focus:outline-none transition-all duration-300 text-lg shadow-inner-custom"
            required
          />
        </div>

        <div className="relative mb-8">
          <Lock
            size={22}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/15 text-white placeholder-gray-300 rounded-xl 
                       border border-transparent focus:border-teal-400 focus:ring-2 focus:ring-teal-400 
                       focus:outline-none transition-all duration-300 text-lg shadow-inner-custom"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 
                     bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 
                     text-white font-bold py-4 rounded-xl shadow-lg 
                     hover:from-emerald-600 hover:to-teal-800 
                     transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
        >
          <UserPlus size={22} /> Register
        </button>

        <p className="mt-8 text-center text-gray-400 text-opacity-80 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline font-semibold transition-colors"
          >
            Login here
          </Link>
        </p>
      </form>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
        .shadow-inner-custom {
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Register;
