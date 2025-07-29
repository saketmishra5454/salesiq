// src/pages/Customers.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("/api/customers", config);
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("❌ Failed to fetch customers");
    }
  };

  const handleDelete = async (id) => {
    toast("⚠️ Are you sure you want to delete this customer?", {
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          try {
            const token = localStorage.getItem("authToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/customers/${id}`, config);
            toast.success("✅ Customer deleted successfully");
            fetchCustomers();
          } catch (error) {
            console.error("Error deleting customer:", error);
            toast.error("❌ Failed to delete customer");
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((cust) =>
    cust.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster richColors position="top-center" expand={true} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
          👥 Customer List
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search customers..."
            className="border border-gray-300 px-4 py-2 rounded shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link
            to="/add-customer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Add Customer
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={customer._id} className="text-center hover:bg-gray-100">
                <td className="py-2 px-4 border font-medium">{index + 1}</td>
                <td className="py-2 px-4 border">{customer.name}</td>
                <td className="py-2 px-4 border">{customer.email}</td>
                <td className="py-2 px-4 border">{customer.phone}</td>
                <td className="py-2 px-4 border space-x-2">
                  <Link
                    to={`/edit-customer/${customer._id}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
