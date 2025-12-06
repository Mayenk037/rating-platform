const express = require("express");
const router = express.Router();

const {
  addUser,
  addStore,
  getUsers,
  getStores,
  getDashboard,
  getUserById,
} = require("../controllers/adminController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Admin only
router.post("/add-user", authMiddleware, authorizeRoles("ADMIN"), addUser);
router.post("/add-store", authMiddleware, authorizeRoles("ADMIN"), addStore);

router.get("/dashboard", authMiddleware, authorizeRoles("ADMIN"), getDashboard);

router.get("/users", authMiddleware, authorizeRoles("ADMIN"), getUsers);
router.get("/users/:id", authMiddleware, authorizeRoles("ADMIN"), getUserById);

router.get("/stores", authMiddleware, authorizeRoles("ADMIN"), getStores);

module.exports = router;
