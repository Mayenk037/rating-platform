// backend/src/server.js

const app = require("./app");
const { connectDB, sequelize } = require("./config/db");
require("./models/User");
require("./models/Store");
require("./models/Rating");

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  // This will create tables if they don't exist
  await sequelize.sync({ alter: true }); // use { force: true } only in dev to drop & recreate tables

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
