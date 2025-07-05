const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db.js");

const Users = sequelize.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  try {
    await Users.sync();
    console.log("The users table has been successfully created or updated");
  } catch (error) {
    console.error("Error syncing the User model: ", error.message);
  }
})();

module.exports = Users;
