// src/pages/RecordSale.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";

const RecordSale = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [invoiceBlobUrl, setInvoiceBlobUrl] = useState(null);
  const [form, setForm] = useState({
    productId: "",
    quantity: 1,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("/api/products", config);
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // Add item to cart
  const handleAddToCart = () => {
    const selectedProduct = products.find((p) => p._id === form.productId);
    if (!selectedProduct) return toast.error("Please select a product");

    if (cart.some((item) => item.product._id === selectedProduct._id)) {
      return toast.warning("Product already in cart");
    }

    if (form.quantity < 1) {
      return toast.error("Quantity must be at least 1");
    }

    const newItem = {
      product: selectedProduct,
      quantity: parseInt(form.quantity),
      total: selectedProduct.price * form.quantity,
    };

    setCart([...cart, newItem]);
    setForm({ ...form, productId: "", quantity: 1 });
    toast.success("✅ Product added to basket");
  };

  // Remove from cart
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.product._id !== id));
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate total
  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  // Submit sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Cart is empty");

    const { customerName, customerEmail, customerPhone, date } = form;

    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const newCustomer = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      };

      const customerRes = await axios.post("/api/customers", newCustomer, config);
      const customerId = customerRes.data.customer._id;

      const sale = {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        totalAmount,
        date,
      };

      await axios.post("/api/sales", sale, config);

      toast.success("✅ Sale recorded successfully!");
      generateInvoice(sale);

      setForm({
        productId: "",
        quantity: 1,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        date: new Date().toISOString().split("T")[0],
      });
      setCart([]);
    } catch (err) {
      console.error("Error recording sale:", err);
      toast.error("❌ Failed to record sale");
    }
  };

  // Generate PDF and send email
 const generateInvoice = (sale) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ===== HEADER =====
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Saket Enterprises", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("GLA University Road, Mathura, UP - 281406", pageWidth / 2, 26, { align: "center" });
  doc.text("Phone: +91-9876543210 | Email: support@saketenterprises.com", pageWidth / 2, 31, { align: "center" });
  doc.text("GSTIN: 09ABCDE1234F1Z5", pageWidth / 2, 36, { align: "center" });

  // ===== INVOICE TITLE =====
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(44, 62, 80);
  doc.text("INVOICE", 14, 50);

  // ===== CUSTOMER INFO =====
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${sale.date}`, 14, 58);
  doc.text(`Customer: ${sale.customerName}`, 14, 64);
  doc.text(`Phone: ${sale.customerPhone}`, 14, 70);
  doc.text(`Email: ${sale.customerEmail}`, 14, 76);

  // ===== TABLE OF ITEMS =====
  autoTable(doc, {
    startY: 90,
    head: [["Product", "Quantity", "Price", "Total(in INR)"]],
    body: cart.map((item) => [
      item.product.name,
      item.quantity,
      `${item.product.price.toFixed(2)}`,
      `${item.total.toFixed(2)}`,
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: 'middle',
      halign: 'center',
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      fillColor: [248, 248, 248],
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
  });

  const finalY = doc.lastAutoTable.finalY || 120;

  // ===== TOTAL =====
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Amount(INR): ${totalAmount.toFixed(2)}`, pageWidth - 20, finalY + 5, { align: "right" });

  // ===== SIGNATURE SECTION =====
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Authorized Signature", pageWidth - 60, finalY + 40);
  doc.line(pageWidth - 90, finalY + 35, pageWidth - 20, finalY + 35); // Signature line

  // ===== THANK YOU =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("Thank you for your purchase!", 14, finalY + 50);

  // ===== CREATE PDF BLOB AND PREVIEW =====
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  setInvoiceBlobUrl(url);

  // ===== EMAIL CONFIRMATION PROMPT =====
  Swal.fire({
    title: "Send invoice via email?",
    text: "The invoice will be emailed to the customer.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, send it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          await axios.post("/api/send-invoice", {
            to: sale.customerEmail,
            subject: `🧾 Your Invoice from Saket Enterprises`,
            text: `Dear ${sale.customerName},\n\nThank you for shopping with us!\nAttached is your invoice.\n\nWarm regards,\nSaket Enterprises`,
            attachment: base64data,
          });
          toast.success("✅ Invoice emailed successfully");
        } catch (err) {
          toast.error("Failed to send invoice");
          console.error("Email error:", err);
        }
      };
    }
  });
};



  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <Toaster richColors position="top-center" expand={true} />
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">🛒 Record New Sale</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Product</label>
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">-- Select Product --</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} (₹{product.price}) - Stock: {product.stock}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          ➕ Add to Basket
        </button>

        <div className="border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">🧺 Basket</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-600">No items in basket</p>
          ) : (
            <ul className="divide-y divide-gray-300">
              {cart.map((item) => (
                <li key={item.product._id} className="flex justify-between py-2">
                  <div>
                    {item.product.name} (₹{item.product.price}) × {item.quantity}
                  </div>
                  <div className="flex gap-4">
                    <span className="font-semibold">₹{item.total}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:underline"
                      onClick={() => removeItem(item.product._id)}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={form.customerName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="customerEmail"
            placeholder="Customer Email"
            value={form.customerEmail}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="customerPhone"
            placeholder="Customer Phone"
            value={form.customerPhone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="text-right text-lg font-bold text-blue-700">
          Total: ₹{totalAmount}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
        >
          💾 Record Sale & Generate Invoice
        </button>
      </form>

      {invoiceBlobUrl && (
        <div className="mt-6 text-center">
          <a
            href={invoiceBlobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            🖨️ View / Download Invoice
          </a>
        </div>
      )}
    </div>
  );
};

export default RecordSale;
