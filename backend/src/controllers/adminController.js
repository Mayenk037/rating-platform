// backend/src/controllers/adminController.js

const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// ----------------------------
// 1) Add User (Admin, User, Owner)
// ----------------------------
exports.addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["ADMIN", "USER", "OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      password: hashed,
      role,
    });

    return res.status(201).json({
      message: "User added successfully",
      user,
    });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// 2) Add Store
// ----------------------------
exports.addStore = async (req, res) => {
  try {
    const { name, address, ownerId } = req.body;

    if (!name || !address || !ownerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== "OWNER") {
      return res.status(400).json({ message: "Owner ID is invalid" });
    }

    const store = await Store.create({ name, address, ownerId });

    return res.status(201).json({
      message: "Store added successfully",
      store,
    });
  } catch (error) {
    console.error("Add store error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// 3) Admin Dashboard
// ----------------------------
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    return res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// 4) List Users (with filter + sorting)
// ----------------------------
exports.getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "ASC",
    } = req.query;

    const where = {};

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (email) {
      where.email = { [Op.iLike]: `%${email}%` };
    }
    if (address) {
      where.address = { [Op.iLike]: `%${address}%` };
    }
    if (role) {
      where.role = role;
    }

    const users = await User.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      attributes: ["id", "name", "email", "address", "role"],
    });

    return res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ----------------------------
// 5) List Stores (with rating + owner email)
// ----------------------------
exports.getStores = async (req, res) => {
  try {
    const { name, address, sortBy = "name", order = "ASC" } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: ["value"],
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [[sortBy, order.toUpperCase()]],
    });

    const formatted = stores.map((store) => {
      const ratings = store.Ratings?.map((r) => r.value) || [];
      const avg =
        ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
          : "0.00";

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        ownerId: store.owner?.id,
        ownerName: store.owner?.name,
        ownerEmail: store.owner?.email,
        averageRating: avg,
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.error("Get stores error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ----------------------------
// 6) View User by ID
// ----------------------------
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Store,
          as: "stores",
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    console.error("Get user by id:", error);
    res.status(500).json({ message: "Server error" });
  }
};
