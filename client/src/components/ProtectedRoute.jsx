import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
