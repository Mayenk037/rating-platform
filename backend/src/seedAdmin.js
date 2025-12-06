// backend/src/seedAdmin.js

const bcrypt = require("bcryptjs");
const { sequelize } = require("./config/db");
const User = require("./models/User");
require("dotenv").config();

async function createAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const email = "admin@example.com";
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashed = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Default System Administrator",
      email,
      address: "Admin Address, City, Country",
      password: hashed,
      role: "ADMIN",
    });

    console.log("✅ Admin user created:");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
