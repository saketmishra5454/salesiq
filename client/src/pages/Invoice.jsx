import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Invoice = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const token = localStorage.getItem("authToken"); // assuming auth
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("http://localhost:5000/api/sales", config);
        const found = res.data.find((s) => s._id === id);
        setSale(found);
      } catch (err) {
        console.error("Failed to load invoice", err);
      }
    };

    fetchSale();
  }, [id]);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Saket Enterprises", 14, 20);
    doc.setFontSize(11);
    doc.text("GLA University Road, Mathura, UP - 281406", 14, 28);
    doc.text("Phone: +91-9876543210 | support@saketenterprises.com", 14, 34);
    doc.text("GSTIN: 09ABCDE1234F1Z5", 14, 40);

    doc.setFontSize(16);
    doc.text("🧾 Invoice", 90, 55);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${sale._id}`, 14, 70);
    doc.text(`Date: ${new Date(sale.date).toLocaleDateString()}`, 14, 78);
    doc.text(`Customer: ${sale.customerName}`, 14, 86);
    doc.text(`Phone: ${sale.customerPhone}`, 14, 94);
    doc.text(`Email: ${sale.customerEmail}`, 14, 102);

    autoTable(doc, {
      startY: 110,
      head: [["Product", "Qty", "Price", "Total(in INR)"]],
      body: sale.items.map((item) => [
        item.product.name,
        item.quantity,
        `₹${item.product.price}`,
        `₹${(item.product.price * item.quantity).toFixed(2)}`
      ]),
    });

    doc.setFontSize(12);
    doc.text(`Total Amount: INR ${sale.totalAmount}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`invoice-${sale._id}.pdf`);
  };

  if (!sale) return <p className="text-center mt-10 text-gray-500">Loading invoice...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-lg border">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-blue-700">Saket Enterprises</h1>
        <p className="text-sm text-gray-600">GLA University Road, Mathura, UP - 281406</p>
        <p className="text-sm text-gray-600">📞 +91-9876543210 | ✉️ support@saketenterprises.com</p>
        <p className="text-sm text-gray-600">GSTIN: 09ABCDE1234F1Z5</p>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">🧾 Invoice</h2>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
        <p><strong>Invoice ID:</strong> {sale._id}</p>
        <p><strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}</p>
        <p><strong>Customer:</strong> {sale.customerName}</p>
        <p><strong>Phone:</strong> {sale.customerPhone}</p>
        <p><strong>Email:</strong> {sale.customerEmail}</p>
      </div>

      <table className="w-full text-sm border mb-6">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Total(in INR)</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border">{item.product.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">₹{item.product.price}</td>
              <td className="p-2 border">₹{item.product.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-right text-lg font-semibold">Total Amount: ₹{sale.totalAmount}</p>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          🖨️ Print
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          📥 Download PDF
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Thank you for your purchase! We hope to serve you again.
      </p>
    </div>
  );
};

export default Invoice;
