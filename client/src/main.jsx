import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <Toaster richColors position="top-center" />

    </BrowserRouter>
  </React.StrictMode>
);
