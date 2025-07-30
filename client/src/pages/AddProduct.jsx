// src/pages/AddProduct.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { PackagePlus } from "lucide-react";

const AddProduct = () => {
  const [product, setProduct] = useState({ name: "", price: "", stock: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post("/api/products", product, config);
      toast.success("Product added successfully!");
      setTimeout(() => navigate("/products"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product. Please try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <Toaster richColors position="top-center" expand={true} />
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center gap-2 mb-6">
          <PackagePlus className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={product.price}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={product.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            ➕ Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
