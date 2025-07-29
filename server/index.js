// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/salesDB";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schemas
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});

const saleSchema = new mongoose.Schema({
  customerId: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalAmount: Number,
  date: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Models
const Customer = mongoose.model("Customer", customerSchema);
const Product = mongoose.model("Product", productSchema);
const Sale = mongoose.model("Sale", saleSchema);
const User = mongoose.model("User", userSchema);

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// 🔐 AUTH ROUTES
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();

  res.json({ message: "User registered successfully" });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.status(200).json({ message: "Login successful", token, username: user.username });
});

app.get("/api/customers", verifyToken, async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

app.post("/api/customers", verifyToken, async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) return res.status(400).json({ message: "All fields are required" });
  const customer = await Customer.findOne({email});
  console.log(customer)
  if(customer){
    return res.status(201).json({message: "Customer added", customer})
  }
  const newCustomer = new Customer({ name, email, phone });
  await newCustomer.save();
  res.status(201).json({ message: "Customer added", customer: newCustomer });
});

app.get("/api/customers/:id", verifyToken, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (customer) res.json(customer);
  else res.status(404).json({ message: "Customer not found" });
});

app.put("/api/customers/:id", verifyToken, async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updated) res.json({ message: "Customer updated", customer: updated });
  else res.status(404).json({ message: "Customer not found" });
});

app.delete("/api/customers/:id", verifyToken, async (req, res) => {
  const deleted = await Customer.findByIdAndDelete(req.params.id);
  if (deleted) res.json({ message: "Customer deleted" });
  else res.status(404).json({ message: "Customer not found" });
});

app.get("/api/products", verifyToken, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get("/api/products/:id", verifyToken, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: "Product not found" });
});

app.post("/api/products", verifyToken, async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || !price || !stock) return res.status(400).json({ message: "All product fields are required" });

  const newProduct = new Product({ name, price, stock });
  await newProduct.save();
  res.status(201).json({ message: "Product added", product: newProduct });
});

app.put("/api/products/:id", verifyToken, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updated) res.json({ message: "Product updated", product: updated });
  else res.status(404).json({ message: "Product not found" });
});

app.delete("/api/products/:id", verifyToken, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (deleted) res.json({ message: "Product deleted" });
  else res.status(404).json({ message: "Product not found" });
});

// 💰 SALES ROUTES
app.get("/api/sales", verifyToken, async (req, res) => {
  try {
    const sales = await Sale.find().populate("items.product"); // 👈 populate product info
    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/sales/:id", verifyToken, async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (sale) res.json(sale);
  else res.status(404).json({ message: "Sale not found" });
});

// ✅ NEW MULTI-PRODUCT SALE
app.post("/api/sales", verifyToken, async (req, res) => {
  const { customerId, customerName, customerEmail, customerPhone, items, totalAmount, date } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  try {
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      product.stock -= item.quantity;
      await product.save();
    }

    const sale = new Sale({ customerId, customerName, customerEmail, customerPhone, items, totalAmount, date });
    await sale.save();
    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (err) {
    console.error("❌ Error saving sale:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📧 EMAIL ROUTE
app.post("/api/send-invoice", async (req, res) => {
  const { to, subject, text, attachment } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Saket Enterprises" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments: [
        {
          filename: "invoice.pdf",
          content: attachment.split("base64,")[1],
          encoding: "base64",
        },
      ],
    });

    res.status(200).json({ message: "Invoice sent successfully" });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    res.status(500).json({ error: "Failed to send invoice email" });
  }
});

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
