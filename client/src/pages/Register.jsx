import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import React from "react"; // Changed from 'react-dom' to 'react'
import { toast, Toaster } from "sonner";
import { UserPlus, User, Lock, ShoppingCart } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", {
        username,
        password,
      });
      toast.success("Registration successful ✅ Welcome to SalesIQ! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌ Username might be taken or too short.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-teal-950 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Enhanced Animated Glowing Blobs */}
      <div className="absolute inset-0 z-10 opacity-70">
        <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '40px', '--y-offset': '-60px', '--scale': '1.2', animationDuration: '9s'}}></div>
        <div className="absolute top-[60%] left-[5%] w-72 h-72 bg-lime-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '-50px', '--y-offset': '30px', '--scale': '1.15', animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute top-[30%] right-[10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '70px', '--y-offset': '40px', '--scale': '1.25', animationDuration: '11s', animationDelay: '4s'}}></div>
        <div className="absolute bottom-[10%] right-[20%] w-64 h-64 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '-30px', '--y-offset': '-50px', '--scale': '1.1', animationDuration: '8s', animationDelay: '6s'}}></div>
      </div>

      <Toaster richColors position="top-center" expand={true} />
      <form
        onSubmit={handleRegister}
        className="relative z-20 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl border border-white border-opacity-30 shadow-3xl rounded-3xl p-10 w-full max-w-sm mx-4 transform transition-all duration-500 hover:scale-[1.01] overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center mb-8">
          <ShoppingCart size={52} className="text-amber-400 drop-shadow-lg animate-bounce-subtle" />
          <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400 mt-2">
            SalesIQ
          </h2>
          <p className="text-gray-200 text-base mt-2 font-light text-center">
            Your powerful Sales Management Dashboard
          </p>
        </div>
        <p className="text-white text-xl font-semibold mb-6 text-center">
          Create Your Account
        </p>

        <div className="relative mb-5">
          <User size={22} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-15 text-white placeholder-gray-300 rounded-xl border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 text-lg shadow-inner-custom"
            required
          />
        </div>
        <div className="relative mb-8">
          <Lock size={22} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-15 text-white placeholder-gray-300 rounded-xl border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 text-lg shadow-inner-custom"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-teal-800 text-white font-bold py-4 rounded-xl shadow-lg hover:from-green-800 hover:to-teal-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
        >
          <UserPlus size={22} /> Register
        </button>

        <p className="mt-8 text-center text-gray-300 text-opacity-80 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-300 hover:underline font-semibold transition-colors">
            Login here
          </Link>
        </p>
      </form>

      {/* Tailwind CSS keyframes for custom animations (same as Login.js) */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(var(--x-offset-start, 0), var(--y-offset-start, 0)) scale(var(--scale-start, 1)); }
          33% { transform: translate(var(--x-offset-mid1, 30px), var(--y-offset-mid1, -50px)) scale(var(--scale-mid1, 1.1)); }
          66% { transform: translate(var(--x-offset-mid2, -20px), var(--y-offset-mid2, 20px)) scale(var(--scale-mid2, 0.9)); }
        }
        .animate-blob {
          animation: blob var(--animation-duration, 7s) infinite alternate ease-in-out;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
        
        /* Custom inner shadow for inputs */
        .shadow-inner-custom {
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        /* Custom outer shadow for form (more pronounced) */
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  );
};

export default Register;