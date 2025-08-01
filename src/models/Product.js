import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";

export const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.ENUM("Cricket", "Football", "Rugby", "Tennis"),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Available", "Out of Stock"),
    allowNull: false,
  },
  imageUrls: {
    type: DataTypes.JSON, // Array of image URLs
    allowNull: true,
  },
});
