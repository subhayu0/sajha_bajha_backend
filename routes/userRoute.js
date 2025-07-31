const express = require("express");
const {
  getAllUsers,
  registerUser,
  updateUserById,
  deleteUserById,
} = require("../controller/userController");

const router = express.Router();

// Middleware to parse JSON (this is usually done at app level, but keeping it here for safety)
router.use(express.json());

// Add error checking middleware to verify functions are loaded
router.use((req, res, next) => {
  // Debug: Check if functions are properly imported
  if (typeof getAllUsers !== 'function') {
    console.error('getAllUsers is not a function:', typeof getAllUsers);
  }
  if (typeof registerUser !== 'function') {
    console.error('registerUser is not a function:', typeof registerUser);
  }
  if (typeof updateUserById !== 'function') {
    console.error('updateUserById is not a function:', typeof updateUserById);
  }
  if (typeof deleteUserById !== 'function') {
    console.error('deleteUserById is not a function:', typeof deleteUserById);
  }
  next();
});

// Routes
router.get("/users", getAllUsers);
router.post("/users", registerUser);
router.patch("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

module.exports = router;
