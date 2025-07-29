// src/pages/Products.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner"; // ✅ Sonner for modern toasts

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get("/api/products", config);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    toast("Are you sure you want to delete this product?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`/api/products/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(products.filter((p) => p._id !== id));
            toast.success("Product deleted successfully");
          } catch (err) {
            console.error("Failed to delete product", err);
            toast.error("Failed to delete product");
          }
        },
      },
    });
  };

  return (
    <div className="p-6">
      <Toaster richColors position="top-center" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📦 Product List</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded shadow-sm focus:outline-none"
          />
          <Link
            to="/add-product"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
          >
            ➕ Add Product
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded shadow overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr
                key={product._id}
                className="border-t hover:bg-gray-50 text-sm text-gray-800"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      <Pencil size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
