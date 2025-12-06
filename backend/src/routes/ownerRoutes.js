// backend/src/routes/ownerRoutes.js

const express = require("express");
const router = express.Router();

const {
  getMyStores,
  getStoreRatings,
} = require("../controllers/ownerController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// All routes require OWNER role
router.get(
  "/stores",
  authMiddleware,
  authorizeRoles("OWNER"),
  getMyStores
);

router.get(
  "/stores/:storeId/ratings",
  authMiddleware,
  authorizeRoles("OWNER"),
  getStoreRatings
);

module.exports = router;
