import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LayoutDashboard,
  Package,
  Users,
  ReceiptText,
  BarChart,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    toast("🚪 Ready to log out?", {
      description: "You'll need to sign in again to access your dashboard.",
      action: {
        label: "Logout",
        onClick: () => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("username");
          navigate("/login");
          toast.success("Logged out successfully!");
        },
      },
      cancel: { label: "Cancel" },
      duration: 3000,
      position: "top-center",
    });
  };

  const navItems = [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { label: "Products", path: "/products", icon: <Package size={18} /> },
    { label: "Customers", path: "/customers", icon: <Users size={18} /> },
    { label: "Record Sale", path: "/record-sale", icon: <ReceiptText size={18} /> },
    { label: "Sales History", path: "/sales", icon: <BarChart size={18} /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-700 to-indigo-800 text-white shadow-lg px-4 sm:px-6 py-7 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <ShoppingCart
            size={32}
            className="text-yellow-400 group-hover:scale-105 transition-transform"
          />
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
            SalesIQ
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-md hover:bg-blue-600 transition"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center gap-6">
          {isLoggedIn &&
            navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 text-sm sm:text-base font-medium transition-colors
                    hover:text-yellow-200 ${
                      pathname === item.path ? "text-yellow-300 font-semibold" : ""
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}

          {isLoggedIn && username && (
            <li className="text-xs px-3 py-1 bg-yellow-500 text-blue-900 rounded-full font-semibold shadow-sm">
              👋 {username}
            </li>
          )}

          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-00 text-white text-sm font-medium rounded-full shadow-md transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${pathname === "/login" ? "bg-blue-600 text-white" : "bg-blue-700 hover:bg-blue-600"}`}
                >
                  <LogIn size={18} /> Login
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${pathname === "/register" ? "bg-purple-600 text-white" : "bg-purple-700 hover:bg-purple-600"}`}
                >
                  <UserPlus size={18} /> Register
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 bg-blue-700 rounded-lg shadow-lg p-4">
          <ul className="flex flex-col gap-4">
            {isLoggedIn &&
              navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors
                      hover:text-yellow-200 ${
                        pathname === item.path ? "text-yellow-300 font-semibold" : "text-white"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}

            {isLoggedIn && username && (
              <li className="text-xs px-3 py-1 bg-yellow-500 text-blue-900 rounded-full font-semibold shadow-sm text-center">
                👋 {username}
              </li>
            )}

            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-md transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${pathname === "/login" ? "bg-blue-600 text-white" : "bg-blue-700 hover:bg-blue-600"}`}
                  >
                    <LogIn size={18} /> Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${pathname === "/register" ? "bg-purple-600 text-white" : "bg-purple-700 hover:bg-purple-600"}`}
                  >
                    <UserPlus size={18} /> Register
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
