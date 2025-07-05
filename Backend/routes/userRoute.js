const express = require("express");
const {
  getAllEmployee,
  saveAllEmployee,
  updateEmployeeById,
  deleteById,
} = require("../controller/userController");

const router = express.Router();
router.use(express.json());
router.get("/users", getAllEmployee);
router.post("/users", saveAllEmployee);
router.patch("/users/:id", updateEmployeeById);
router.delete("/users/:id", deleteById);

module.exports = router;
