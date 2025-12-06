// backend/src/models/Store.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Store = sequelize.define("Store", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
});

// ownerId foreign key
Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Store, { as: "stores", foreignKey: "ownerId" });

module.exports = Store;
