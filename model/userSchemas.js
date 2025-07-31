// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../db/db.js");

// const Users = sequelize.define("users", {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   userID: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// (async () => {
//   try {
//     await Users.sync();
//     console.log("The users table has been successfully created or updated");
//   } catch (error) {
//     console.error("Error syncing the User model: ", error.message);
//   }
// })();

// module.exports = Users;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db.js");

const Users = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name cannot be empty"
      },
      len: {
        args: [2, 100],
        msg: "Name must be between 2 and 100 characters"
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'This email address is already registered'
    },
    validate: {
      isEmail: {
        msg: "Please enter a valid email address"
      },
      notEmpty: {
        msg: "Email cannot be empty"
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'unique_phone',
      msg: 'This phone number is already registered'
    },
    validate: {
      notEmpty: {
        msg: "Phone number cannot be empty"
      },
      is: {
        args: /^9[0-9]{9}$/,
        msg: "Please enter a valid Nepal phone number (10 digits starting with 9)"
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password cannot be empty"
      },
      len: {
        args: [8, 255],
        msg: "Password must be at least 8 characters long"
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['phone']
    }
  ]
});

// Add hooks for additional functionality
Users.addHook('beforeCreate', (user) => {
  // Convert email to lowercase before saving
  user.email = user.email.toLowerCase();
  // Trim whitespace from name
  user.name = user.name.trim();
});

Users.addHook('beforeUpdate', (user) => {
  // Convert email to lowercase before updating
  if (user.email) {
    user.email = user.email.toLowerCase();
  }
  // Trim whitespace from name
  if (user.name) {
    user.name = user.name.trim();
  }
});

(async () => {
  try {
    await Users.sync({ alter: true }); // alter: true will update existing table structure
    console.log("The users table has been successfully created or updated");
  } catch (error) {
    console.error("Error syncing the User model: ", error.message);
  }
})();

module.exports = Users;