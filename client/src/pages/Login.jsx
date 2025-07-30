import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import React from "react";
import { toast, Toaster } from "sonner";
import { LogIn, User, Lock, ShoppingCart } from "lucide-react";

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

      toast.success("Login Successfully🎉");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed ❌ Please check your credentials."
      );
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-24 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 overflow-auto">

      <Toaster richColors position="top-center" expand={true} />

      <form
        onSubmit={handleLogin}
        className="relative z-20 w-full max-w-sm sm:max-w-md md:max-w-lg 
                   bg-white/10 backdrop-filter backdrop-blur-xl rounded-3xl 
                   p-6 sm:p-8 md:p-10 mx-auto
                   shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-transparent 
                   hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(255,193,7,0.4)] 
                   transition-all duration-500 transform hover:-translate-y-1"
      >
        <div className="flex flex-col items-center justify-center">
          <ShoppingCart
            size={52}
            className="text-amber-400 drop-shadow-lg animate-bounce-subtle"
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight 
                         bg-clip-text text-transparent 
                         bg-gradient-to-r from-amber-300 to-amber-500 text-center">
            SalesIQ
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full mt-1 animate-pulse"></div>
          <p className="text-gray-300 text-sm sm:text-base mt-3 font-light text-center mb-5">
            Your Smart Sales Management Dashboard
          </p>
        </div>

        <p className="text-gray-200 text-lg sm:text-xl font-bold mb-6 text-center">
          Admin Login
        </p>

        <div className="relative mb-4">
          <User
            size={20}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white/15 text-white 
                       placeholder-gray-300 rounded-xl text-base sm:text-lg
                       border border-transparent focus:border-amber-400 
                       focus:ring-2 focus:ring-amber-400 
                       focus:outline-none transition-all duration-300 
                       shadow-inner-custom"
            required
          />
        </div>

        <div className="relative mb-8">
          <Lock
            size={20}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white/15 text-white 
                       placeholder-gray-300 rounded-xl text-base sm:text-lg
                       border border-transparent focus:border-purple-400 
                       focus:ring-2 focus:ring-purple-400 
                       focus:outline-none transition-all duration-300 
                       shadow-inner-custom"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 
                     bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 
                     text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg
                     shadow-lg hover:from-purple-600 hover:to-pink-600 
                     transition-all duration-300 transform hover:-translate-y-1 
                     hover:shadow-2xl"
        >
          <LogIn size={20} /> Secure Login
        </button>

        <p className="mt-6 text-center text-gray-400 text-xs sm:text-sm md:text-base">
          New to SalesIQ?{" "}
          <Link
            to="/register"
            className="text-amber-400 hover:underline font-semibold transition-colors"
          >
            Create an Account
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

export default Login;
