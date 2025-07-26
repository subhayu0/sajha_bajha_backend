// model/productSchema.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Product = sequelize.define("Product", {
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

(async () => {
  try {
    await Product.sync();
    console.log("The products table has been successfully created or updated");
  } catch (error) {
    console.error("Error syncing the User model: ", error.message);
  }
})();

module.exports = Product;
