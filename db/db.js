const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  "Sajha-Bajha",
  "postgres",
  "admin123",
  {
    host: process.env.localhost,
    dialect: "postgres", 
  }
);

const db = () => {
  try {
    sequelize.sync({ alter: true });
    console.log("database connected successfully");
  } catch (e) {
    console.error("fail to connect database successfully", e);
  }
};

module.exports = { sequelize, db };
