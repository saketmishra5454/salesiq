import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    console.log("Hi")
    toast("🚪 Do you really want to log out?", {
      action: {
        label: "Yes, Logout",
        onClick: () => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("username");
          navigate("/login");
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const navItems = [
    { label: "🏠 Dashboard", path: "/" },
    { label: "📦 Products", path: "/products" },
    { label: "👥 Customers", path: "/customers" },
    { label: "📝 Record Sale", path: "/record-sale" },
    { label: "📊 Sales History", path: "/sales" }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-purple-600 text-white shadow-md px-8 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <ShoppingCart size={28} />
          <h1 className="text-2xl font-bold tracking-wide">SalesIQ</h1>
        </div>

        {/* Right: Navigation & Auth */}
        <ul className="flex gap-6 items-center">
          {/* Main Navigation - only if logged in */}
          {isLoggedIn &&
            navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`hover:text-yellow-300 text-lg ${
                    pathname === item.path ? "underline font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

          {/* Show username */}
          {isLoggedIn && username && (
            <li className="text-sm text-yellow-200 font-semibold">
              👋 Hi, {username}
            </li>
          )}

          {/* Auth Controls */}
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-red-200 hover:text-white font-semibold"
              >
                🚪 Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hover:text-yellow-300 text-lg ${
                    pathname === "/login" ? "underline font-semibold" : ""
                  }`}
                >
                  🔐 Login
                </Link>
                <Link
                  to="/register"
                  className={`ml-4 hover:text-yellow-300 text-lg ${
                    pathname === "/register" ? "underline font-semibold" : ""
                  }`}
                >
                  📝 Register
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
