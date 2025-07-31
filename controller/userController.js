// const Users = require("../model/userSchemas");

// // Retrive
// const getAllEmployee = async (req, res) => {
//   try {
//     const users = await Users.findAll();
//     res.status(200).json({ data: users, message: "Successfully fetched data" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error while fetching users" });
//   }
// };

// //Create
// const saveAllEmployee = async (req, res) => {
//   const { username, userID, email, password } = req.body;
//   try {
//     const user = await Users.findOne({ where: { userID } });
//     if (user) {
//       return res.status(409).json({ message: "User already present" });
//     }
//     await Users.create({ username, userID, email, password });
//     res.status(201).json({ message: "User added successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error creating user" });
//   }
// };

// //Update
// const updateEmployeeById = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;
//   try {
//     const user = await Users.findOne({ where: { id } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     await user.update(updates);
//     res.status(200).json({ message: "User updated successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error updating user" });
//   }
// };

// //Delete
// const deleteById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await Users.findOne({ where: { id } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     await user.destroy();
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error deleting user" });
//   }
// };

// module.exports = {
//   getAllEmployee,
//   saveAllEmployee,
//   updateEmployeeById,
//   deleteById,
// };

const Users = require("../model/userSchemas");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ['password'] } // Don't send passwords in response
    });
    res.status(200).json({ 
      data: users, 
      message: "Successfully fetched users" 
    });
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({ message: "Error while fetching users" });
  }
};

// User Registration (Signup)
const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  try {
    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please enter a valid email address" 
      });
    }

    // Nepal phone number validation (10 digits starting with 9)
    const phoneRegex = /^9[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: "Please enter a valid Nepal phone number (10 digits starting with 9)" 
      });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters with uppercase, lowercase, and number" 
      });
    }

    // Check if user already exists (by email or phone)
    const existingUser = await Users.findOne({ 
      where: { 
        [Users.sequelize.Sequelize.Op.or]: [
          { email: email },
          { phone: phone }
        ]
      } 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: "User with this email or phone already exists" 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await Users.create({ 
      name, 
      email, 
      phone, 
      password: hashedPassword 
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({ 
      message: "User registered successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.log("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// Update User
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Remove password from updates if present (should be updated separately)
    delete updates.password;
    
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update(updates);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    res.status(200).json({ 
      message: "User updated successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete User
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findOne({ where: { id } });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateUserById,
  deleteUserById,
};