// backend/src/routes/authRoutes.js

const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  updatePassword,
} = require("../controllers/authController");

const { authMiddleware } = require("../middlewares/authMiddleware");

// Normal User Signup
router.post("/signup", signup);

// Login (same for all roles)
router.post("/login", login);

// Update password (must be logged in)
router.post("/update-password", authMiddleware, updatePassword);

module.exports = router;
