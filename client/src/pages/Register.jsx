import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast, Toaster } from "sonner"; // ✅ Import Sonner


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
 toast.success("Registration successful ✅"); // ✅
 navigate("/login");
 } catch (err) {
 toast.error(err.response?.data?.message || "Registration failed ❌"); // ✅
 }
 };


 return (
 <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-[url('https://source.unsplash.com/random?abstract&pastel=1')] bg-no-repeat bg-cover bg-center">
 <div className="absolute inset-0 bg-white opacity-20"></div> {/* Optional: Light overlay */}
 <Toaster richColors position="top-center" expand={true} /> {/* ✅ Sonner toaster */}
 <form
 onSubmit={handleRegister}
 className="relative bg-white shadow-md rounded p-8 w-full max-w-md z-10" // Added relative and z-10
 >
 <h2 className="text-2xl font-bold mb-4 text-center">📝 Register</h2>


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
 className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
 >
 Register
 </button>
 </form>
 </div>
 );
};


export default Register;