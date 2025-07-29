//App.jsx

import React from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom"; // ✅ Router removed
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Sales from "./pages/Sales";
import EditProduct from "./pages/EditProduct";
import RecordSale from "./pages/RecordSale";
import SalesHistory from "./pages/SalesHistory";
import Customers from "./pages/Customers";
import EditCustomer from "./pages/EditCustomer";
import EditSale from "./pages/EditSale";
import Invoice from "./pages/Invoice";
import AddCustomer from "./pages/AddCustomer";


function App() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-customer"
            element={
              <ProtectedRoute>
                <AddCustomer />
              </ProtectedRoute>
            }
          />


          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/record-sale" element={<RecordSale />} />
          <Route path="/sales" element={<SalesHistory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/edit-customer/:id" element={<EditCustomer />} />
          <Route path="/edit-sale/:id" element={<EditSale />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
