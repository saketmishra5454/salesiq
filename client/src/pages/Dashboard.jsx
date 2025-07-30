// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Users,
  ShoppingCart,
  IndianRupee,
  Trophy,
  Repeat,
  Flame,
  Inbox,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c", "#d0ed57"];

const Dashboard = () => {
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [repeatBuyers, setRepeatBuyers] = useState(null);
  const [topCustomer, setTopCustomer] = useState(null);
  const [lowDemandItem, setLowDemandItem] = useState(null);
  const [todayRevenue, setTodayRevenue] = useState(null);
  const [bestseller, setBestseller] = useState(null);
  const [timeFilter, setTimeFilter] = useState("monthly");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [productsRes, customersRes, salesRes] = await Promise.all([
          axios.get("/api/products", config),
          axios.get("/api/customers", config),
          axios.get("/api/sales", config),
        ]);

        const totalProducts = productsRes.data.length;
        const totalCustomers = customersRes.data.length;
        const totalSales = salesRes.data.length;
        const totalRevenue = salesRes.data.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

        const lowStock = productsRes.data.filter((product) => product.stock < 5);
        const outOfStock = productsRes.data.filter((product) => product.stock === 0);
        setLowStockCount(lowStock.length);
        setLowStockItems(lowStock);
        setOutOfStockCount(outOfStock.length);

        setStats({ totalProducts, totalCustomers, totalSales, totalRevenue });

        processSalesData(salesRes.data);
        processTopProducts(salesRes.data);
        processRepeatBuyers(salesRes.data);
        processTopCustomer(salesRes.data);
        processLowDemandProduct(salesRes.data);
        processTodayRevenue(salesRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, [timeFilter]);

  const processSalesData = (data) => {
    const grouped = {};

    data.forEach((sale) => {
      const date = new Date(sale.date);
      let key = "";

      if (timeFilter === "weekly") {
        key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      } else if (timeFilter === "yearly") {
        key = date.getFullYear().toString();
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      grouped[key] = (grouped[key] || 0) + (sale.total || 0);
    });

    const formatted = Object.keys(grouped)
      .map((key) => ({ period: key, total: grouped[key] }))
      .sort((a, b) => a.period.localeCompare(b.period));

    setSalesData(formatted);
  };

  const processTopProducts = (data) => {
    const result = {};
    data.forEach((sale) => {
      sale.items.forEach((item) => {
        const name = item?.product?.name ?? "Unknown Product";
        const quantity = item?.quantity ?? 0;
        result[name] = (result[name] || 0) + quantity;
      });
    });

    const formatted = Object.entries(result).map(([name, value]) => ({ name, value }));
    const sorted = [...formatted].sort((a, b) => b.value - a.value);

    setTopProducts(sorted);
    setBestseller(sorted[0]?.name);
  };

  const processRepeatBuyers = (sales) => {
    const customerCount = {};
    sales.forEach((sale) => {
      customerCount[sale.customerId] = (customerCount[sale.customerId] || 0) + 1;
    });
    const repeat = Object.values(customerCount).filter((count) => count > 1).length;
    setRepeatBuyers(repeat);
  };

  const processTopCustomer = (sales) => {
    const spending = {};
    sales.forEach((sale) => {
      if (!spending[sale.customerName]) spending[sale.customerName] = 0;
      spending[sale.customerName] += sale.total;
    });
    const sorted = Object.entries(spending).sort((a, b) => b[1] - a[1]);
    setTopCustomer(sorted[0]?.[0] || null);
  };

  const processLowDemandProduct = (sales) => {
    const count = {};
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const name = item?.product?.name ?? "Unknown";
        count[name] = (count[name] || 0) + (item?.quantity ?? 0);
      });
    });
    const sorted = Object.entries(count).sort((a, b) => a[1] - b[1]);
    setLowDemandItem(sorted[0]?.[0] || null);
  };

  const processTodayRevenue = (sales) => {
    const today = new Date().toISOString().split("T")[0];
    const revenue = sales
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate.toISOString().split("T")[0] === today;
      })
      .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    setTodayRevenue(revenue);
  };

  const cardClass =
    "relative bg-white bg-opacity-20 backdrop-blur-lg shadow-xl rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 border border-white/20";

  const LowStockBadge = () => (
    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
      Low Stock!
    </span>
  );

  const ExtraCard = ({ icon: Icon, label, value, color = "text-gray-800" }) => (
    <div className={cardClass}>
      <Icon className={`${color} mb-2`} size={32} />
      <h2 className="text-sm sm:text-md font-semibold text-gray-700">{label}</h2>
      <p className="text-lg sm:text-xl font-bold text-gray-900">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
        👋 Welcome{username ? `, ${username}` : ""} to SalesIQ
      </h1>

      {userRole !== "admin" && (
        <div className="mb-4 p-3 sm:p-4 bg-yellow-100 text-yellow-700 rounded shadow text-sm sm:text-base">
          <strong>Notice:</strong> You are logged in as <em>staff</em>. Admin-only actions are restricted.
        </div>
      )}

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className={cardClass}>
          {lowStockCount > 0 && <LowStockBadge />}
          <Package className="text-blue-600 mb-2" size={36} />
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Products</h2>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>

        <div className={cardClass}>
          <ShoppingCart className="text-green-600 mb-2" size={36} />
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Sales</h2>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalSales}</p>
        </div>

        <div className={cardClass}>
          <Users className="text-yellow-600 mb-2" size={36} />
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Customers</h2>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
        </div>

        <div className={cardClass}>
          <IndianRupee className="text-red-600 mb-2" size={36} />
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Revenue</h2>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
        </div>

        <ExtraCard icon={Inbox} label="Out of Stock" value={outOfStockCount} color="text-pink-600" />
        <ExtraCard icon={FileText} label="Invoices Sent" value={stats.totalSales} color="text-indigo-600" />
        <ExtraCard icon={Trophy} label="Top Customer" value={topCustomer} color="text-yellow-600" />
        <ExtraCard icon={Repeat} label="Repeat Buyers" value={repeatBuyers} color="text-green-600" />
        <ExtraCard icon={Flame} label="Low Demand Item" value={lowDemandItem} color="text-red-500" />
        <ExtraCard icon={TrendingUp} label="Revenue Today" value={`₹${todayRevenue}`} color="text-purple-600" />
        <ExtraCard icon={Trophy} label="Bestseller" value={bestseller} color="text-orange-600" />
      </div>

      {/* Filter Dropdown */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-0">
        <select
          className="px-3 sm:px-4 py-2 rounded border shadow bg-white w-full sm:w-auto"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded shadow p-3 sm:p-4"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            📈 {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Sales (₹)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded shadow p-3 sm:p-4"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">🏆 Top-Selling Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topProducts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topProducts.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Low Stock Section */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow p-3 sm:p-4 mt-6 sm:mt-8"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-red-600 mb-3 sm:mb-4">
            ⚠️ Low Stock Products
          </h3>
          <ul className="space-y-2">
            {lowStockItems.map((item) => (
              <li
                key={item._id}
                className="flex flex-col sm:flex-row sm:justify-between px-3 sm:px-4 py-2 bg-red-50 rounded border border-red-200 text-sm sm:text-base"
              >
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-red-600 font-semibold">Stock: {item.stock}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
