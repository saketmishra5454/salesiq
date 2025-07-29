import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState({
    productId: "",
    productName: "",
    customerId: "",
    customerName: "",
    quantity: 1,
    total: 0,
    date: ""
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const saleRes = await axios.get(`/api/sales/${id}`);
        setSale(saleRes.data);

        const productRes = await axios.get("/api/products");
        setProducts(productRes.data);

        const customerRes = await axios.get("/api/customers");
        setCustomers(customerRes.data);
      } catch (err) {
        console.error("Error fetching sale info", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setSale({ ...sale, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/sales/${id}`, sale);
      alert("Sale updated successfully");
      navigate("/sales");
    } catch (err) {
      console.error("Failed to update sale", err);
      alert("Failed to update sale");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Sale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="productId"
          value={sale.productId}
          onChange={(e) => {
            const selectedProduct = products.find(p => p._id === e.target.value);
            setSale({
              ...sale,
              productId: e.target.value,
              productName: selectedProduct?.name || ""
            });
          }}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <select
          name="customerId"
          value={sale.customerId}
          onChange={(e) => {
            const selectedCustomer = customers.find(c => c._id === e.target.value);
            setSale({
              ...sale,
              customerId: e.target.value,
              customerName: selectedCustomer?.name || ""
            });
          }}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          value={sale.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="total"
          value={sale.total}
          onChange={handleChange}
          placeholder="Total Amount"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={sale.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Sale
        </button>
      </form>
    </div>
  );
};

export default EditSale;