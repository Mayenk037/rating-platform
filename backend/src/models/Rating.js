// backend/src/models/Rating.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Store = require("./Store");

const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: "Rating must be at least 1.",
      },
      max: {
        args: [5],
        msg: "Rating cannot be more than 5.",
      },
    },
  },
});

// Relations
User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

module.exports = Rating;
