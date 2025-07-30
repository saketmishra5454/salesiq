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
      toast.error(err.response?.data?.message || "Login failed ❌ Please check your credentials.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-24 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 overflow-auto">


      {/* Subtle Background Pattern */}
     /* <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Enhanced Animated Glowing Blobs */}
      /*<div className="absolute inset-0 z-10 opacity-70">
        <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '40px', '--y-offset': '-60px', '--scale': '1.2', animationDuration: '9s'}}></div>
        <div className="absolute top-[60%] left-[5%] w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '-50px', '--y-offset': '30px', '--scale': '1.15', animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute top-[30%] right-[10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '70px', '--y-offset': '40px', '--scale': '1.25', animationDuration: '11s', animationDelay: '4s'}}></div>
        <div className="absolute bottom-[10%] right-[20%] w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{'--x-offset': '-30px', '--y-offset': '-50px', '--scale': '1.1', animationDuration: '8s', animationDelay: '6s'}}></div>
      </div>*/

      <Toaster richColors position="top-center" expand={true} />

      <form
  onSubmit={handleLogin}
  className="relative z-20 bg-white/10 backdrop-filter backdrop-blur-xl rounded-3xl p-10 w-full max-w-sm mx-4 
             shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-transparent 
             hover:border-amber-400 hover:shadow-[0_12px_40px_rgba(255,193,7,0.4)] 
             transition-all duration-500 transform hover:-translate-y-1"
>
  <div className="flex flex-col items-center justify-center">
    <ShoppingCart size={52} className="text-amber-400 drop-shadow-lg animate-bounce-subtle" />
    <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">
      SalesIQ
    </h2>
    <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full mt-1 animate-pulse"></div>
    <p className="text-gray-300 text-base mt-3 font-light text-center mb-5">
      Your Smart Sales Management Dashboard
    </p>
  </div>

  <p className="text-gray-200 text-xl font-bold mb-5 text-center">
    Admin Login
  </p>

  <div className="relative mb-4">
    <User size={22} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full pl-12 pr-4 py-3 bg-white/15 text-white placeholder-gray-300 rounded-xl 
                 border border-transparent focus:border-amber-400 focus:ring-2 focus:ring-amber-400 
                 focus:outline-none transition-all duration-300 text-lg shadow-inner-custom"
      required
    />
  </div>

  <div className="relative mb-6">
    <Lock size={22} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full pl-12 pr-4 py-3 bg-white/15 text-white placeholder-gray-300 rounded-xl 
                 border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-400 
                 focus:outline-none transition-all duration-300 text-lg shadow-inner-custom"
      required
    />
  </div>

  <button
    type="submit"
    className="w-full flex items-center justify-center gap-2 
               bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 
               text-white font-bold py-4 rounded-xl shadow-lg 
               hover:from-purple-600 hover:to-pink-600 
               transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
  >
    <LogIn size={22} /> Secure Login
  </button>

  <p className="mt-8 text-center text-gray-400 text-opacity-80 text-sm">
    New to SalesIQ?{" "}
    <Link to="/register" className="text-amber-400 hover:underline font-semibold transition-colors">
      Create an Account
    </Link>
  </p>
</form>


      {/* Tailwind CSS keyframes for custom animations */}
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
        /* Custom outer shadow for form */
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  );
};

export default Login;