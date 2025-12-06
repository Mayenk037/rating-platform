// backend/src/config/db.js

const { Sequelize } = require("sequelize");
require("dotenv").config();

// You can keep using DATABASE_URL from your .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // set true if you want to see SQL logs
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
}

module.exports = { sequelize, connectDB };
