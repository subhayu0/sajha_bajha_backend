const Users = require("../model/userSchemas");

// Retrive
const getAllEmployee = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json({ data: users, message: "Successfully fetched data" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching users" });
  }
};

//Create
const saveAllEmployee = async (req, res) => {
  const { username, userID, email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { userID } });
    if (user) {
      return res.status(409).json({ message: "User already present" });
    }
    await Users.create({ username, userID, email, password });
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

//Update
const updateEmployeeById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update(updates);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

//Delete
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  getAllEmployee,
  saveAllEmployee,
  updateEmployeeById,
  deleteById,
};
