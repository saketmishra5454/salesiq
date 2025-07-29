// src/pages/SalesHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight, Download } from "lucide-react";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("http://localhost:5000/api/sales", config);

        // Map through each sale and populate item names
        const populatedSales = await Promise.all(
          res.data.map(async (sale) => {
            if (!sale.items || !sale.items.length) return sale;

            const populatedItems = await Promise.all(
              sale.items.map(async (item) => {
                if (typeof item.product === "object" && item.product.name) {
                  return {
                    ...item,
                    name: item.product.name,
                  };
                }

                try {
                  const productRes = await axios.get(
                    `http://localhost:5000/api/products/${item.product}`,
                    config
                  );
                  return {
                    ...item,
                    name: productRes.data.name,
                  };
                } catch (err) {
                  console.error("Failed to load product", item.product);
                  return { ...item, name: "Unknown" };
                }
              })
            );

            return { ...sale, items: populatedItems };
          })
        );

        setSales(populatedSales);
        setFilteredSales(populatedSales);
      } catch (err) {
        console.error("Error loading sales:", err);
      }
    };
    fetchSales();
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const result = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= from && saleDate <= to;
    });

    setFilteredSales(result);
  };

  const downloadCSV = () => {
    const headers = [
      "Date",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Products",
      "Total",
    ];

    const rows = filteredSales.map((sale) => {
      const formattedDate = new Date(sale.date).toLocaleDateString("en-IN");
      const productList = sale.items
        ? sale.items.map((item) => `${item.name} x${item.quantity}`).join(" | ")
        : `${sale.productName} x${sale.quantity}`;
      const total = sale.totalAmount || sale.total || 0;

      return [
        formattedDate,
        sale.customerName || "-",
        sale.customerEmail || "-",
        sale.customerPhone || "-",
        productList,
        total.toFixed(2),
      ];
    });

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        📊 Sales History
      </h2>

      <div className="flex items-end gap-4 mb-6 flex-wrap">
        <div>
          <label className="block font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded shadow-sm"
          />
        </div>
        <div>
          <label className="block font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded shadow-sm"
          />
        </div>
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Apply Filter
        </button>
        {filteredSales.length > 0 && (
          <button
            onClick={downloadCSV}
            className="px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <Download size={18} /> Export CSV
          </button>
        )}
      </div>

      {filteredSales.length === 0 ? (
        <p className="text-gray-500">No sales found for this range.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-purple-200 text-gray-800">
                <th className="p-3 text-left">📅 Date</th>
                <th className="p-3 text-left">👤 Customer</th>
                <th className="p-3 text-left">📦 Products</th>
                <th className="p-3 text-left">💰 Total</th>
                <th className="p-3 text-left">📈 Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => {
                const total = sale.totalAmount || sale.total || 0;
                const isUp =
                  index > 0 &&
                  total >=
                    (filteredSales[index - 1].totalAmount ||
                      filteredSales[index - 1].total ||
                      0);

                const productList = sale.items
                  ? sale.items.map((item) => `${item.name} x${item.quantity}`).join(", ")
                  : `${sale.productName} x${sale.quantity}`;

                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-3 text-gray-800">{sale.date || "-"}</td>
                    <td className="p-3 font-medium">{sale.customerName || "-"}</td>
                    <td className="p-3 text-gray-700">{productList}</td>
                    <td className="p-3 font-semibold text-green-700">₹{total.toFixed(2)}</td>
                    <td className="p-3">
                      {index > 0 ? (
                        isUp ? (
                          <span className="text-green-600 inline-flex items-center gap-1 font-semibold">
                            <ArrowUpRight size={16} /> Up
                          </span>
                        ) : (
                          <span className="text-red-600 inline-flex items-center gap-1 font-semibold">
                            <ArrowDownRight size={16} /> Down
                          </span>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
