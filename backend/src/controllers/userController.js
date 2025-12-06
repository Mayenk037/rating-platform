// backend/src/controllers/userController.js

const { Op } = require("sequelize");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

// ----------------------------
// 1) List stores for normal user
// ----------------------------
exports.getStoresForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: ["value", "userId"],
        },
      ],
    });

    const data = stores.map((store) => {
      const ratings = store.Ratings || [];
      const values = ratings.map((r) => r.value);
      const overall =
        values.length > 0
          ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
          : "0.00";

      const userRating =
        ratings.find((r) => r.userId === userId)?.value ?? null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: overall,
        userRating,
      };
    });

    return res.json(data);
  } catch (error) {
    console.error("User get stores error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// 2) Submit rating (new)
// ----------------------------
exports.submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { value } = req.body;

    const numeric = Number(value);

    if (!numeric || numeric < 1 || numeric > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5" });
    }

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Check if user already rated
    const existing = await Rating.findOne({
      where: { userId, storeId },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already rated this store. Use update." });
    }

    const rating = await Rating.create({
      userId,
      storeId,
      value: numeric,
    });

    return res.status(201).json({
      message: "Rating submitted successfully",
      rating,
    });
  } catch (error) {
    console.error("Submit rating error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// 3) Update rating
// ----------------------------
exports.updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { value } = req.body;

    const numeric = Number(value);

    if (!numeric || numeric < 1 || numeric > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5" });
    }

    const rating = await Rating.findOne({
      where: { userId, storeId },
    });

    if (!rating) {
      return res
        .status(404)
        .json({ message: "No rating found for this store to update" });
    }

    rating.value = numeric;
    await rating.save();

    return res.json({
      message: "Rating updated successfully",
      rating,
    });
  } catch (error) {
    console.error("Update rating error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
