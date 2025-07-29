import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`/api/products/${id}`, config);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
        toast.error("❌ Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log("Sending Update Payload:", product); // ✅ Debug
      await axios.put(`/api/products/${id}`, product, config);

      toast.success("✅ Product updated successfully");
      navigate("/products");
    } catch (err) {
      console.error("Failed to update product", err.response?.data || err.message);
      toast.error("❌ Failed to update product");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <Toaster richColors position="top-center" expand={true} />
      <h2 className="text-xl font-bold mb-4">✏️ Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Price"
          required
        />
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Stock"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          ✅ Update
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
