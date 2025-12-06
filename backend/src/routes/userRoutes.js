// backend/src/routes/userRoutes.js

const express = require("express");
const router = express.Router();

const {
  getStoresForUser,
  submitRating,
  updateRating,
} = require("../controllers/userController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Normal user routes
router.get(
  "/stores",
  authMiddleware,
  authorizeRoles("USER"),
  getStoresForUser
);

router.post(
  "/stores/:storeId/rate",
  authMiddleware,
  authorizeRoles("USER"),
  submitRating
);

router.put(
  "/stores/:storeId/rate",
  authMiddleware,
  authorizeRoles("USER"),
  updateRating
);

module.exports = router;
