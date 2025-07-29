import React, { useEffect, useState } from "react";
import axios from "axios";

const Sales = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [custRes, prodRes] = await Promise.all([
        axios.get("http://localhost:5000/api/customers", config),
        axios.get("http://localhost:5000/api/products", config),
      ]);

      setCustomers(custRes.data);
      setProducts(prodRes.data);
    };

    fetchData();
  }, []);

  // Calculate total on item change
  useEffect(() => {
    const total = items.reduce((acc, item) => {
      const product = products.find((p) => p._id === item.product);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
    setTotalAmount(total);
  }, [items, products]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "quantity" ? parseInt(value) : value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const customer = customers.find((c) => c._id === selectedCustomer);
    if (!customer) return alert("Please select a valid customer.");

    const payload = {
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      items,
      totalAmount,
      date: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/api/sales", payload, config);
      alert("✅ Sale recorded!");
      setItems([{ product: "", quantity: 1 }]);
      setSelectedCustomer("");
    } catch (err) {
      console.error("❌ Sale submission failed:", err);
      alert("❌ Failed to record sale.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-6">🧾 Record a Sale</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block mb-2 font-medium">Select Customer:</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
          >
            <option value="">-- Select Customer --</option>
            {customers.map((cust) => (
              <option key={cust._id} value={cust._id}>
                {cust.name} ({cust.phone})
              </option>
            ))}
          </select>
        </div>

        {/* Product Items */}
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium">Product</label>
              <select
                value={item.product}
                onChange={(e) =>
                  handleItemChange(index, "product", e.target.value)
                }
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Select --</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} (₹{product.price}) - Stock: {product.stock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                className="w-full border p-2 rounded"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                required
              />
            </div>

            <div className="md:col-span-1">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:underline mt-6"
                disabled={items.length === 1}
              >
                ❌ Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="text-blue-600 hover:underline"
        >
          ➕ Add Another Product
        </button>

        {/* Total */}
        <div className="text-right text-lg font-semibold text-gray-800">
          Total: ₹{totalAmount}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          ✅ Record Sale
        </button>
      </form>
    </div>
  );
};

export default Sales;
