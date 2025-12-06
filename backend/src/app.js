// backend/src/app.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/owner", ownerRoutes);

// Routes
const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

module.exports = app;
