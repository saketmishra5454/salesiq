// src/pages/AddCustomer.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { UserPlus } from "lucide-react";

const AddCustomer = () => {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post("/api/customers", customer, config);
      toast.success("Customer added successfully!");
      setTimeout(() => navigate("/customers"), 1500);
    } catch (err) {
      console.error("Error adding customer:", err);
      toast.error("Failed to add customer. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      <Toaster richColors position="top-center" expand={true} />
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-green-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Add New Customer</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={customer.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
          >
            ➕ Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
