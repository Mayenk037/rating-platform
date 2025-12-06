// backend/src/controllers/ownerController.js

const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User");

// 1) List all stores owned by logged-in owner
exports.getMyStores = async (req, res) => {
  try {
    const ownerId = req.user.id; // from token

    const stores = await Store.findAll({
      where: { ownerId },
    });

    return res.json(stores);
  } catch (error) {
    console.error("Owner getMyStores error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2) View ratings + average for a specific store of this owner
exports.getStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { storeId } = req.params;

    // Check that store belongs to this owner
    const store = await Store.findOne({
      where: { id: storeId, ownerId },
    });

    if (!store) {
      return res
        .status(404)
        .json({ message: "Store not found or not owned by you" });
    }

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const values = ratings.map((r) => r.value);
    const avg =
      values.length > 0
        ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
        : "0.00";

    const formatted = ratings.map((r) => ({
      id: r.id,
      value: r.value,
      createdAt: r.createdAt,
      user: {
        id: r.User.id,
        name: r.User.name,
        email: r.User.email,
      },
    }));

    return res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
      },
      averageRating: avg,
      totalRatings: ratings.length,
      ratings: formatted,
    });
  } catch (error) {
    console.error("Owner getStoreRatings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
