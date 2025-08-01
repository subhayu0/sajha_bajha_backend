import express from "express";
import { orderController } from "../../controller/index.js";
import { authenticateToken as verifyToken } from "../../middleware/token-middleware.js";

const router = express.Router();

// Create a new order
router.post("/", verifyToken, orderController.createOrder);

// Get all orders (admin only)
router.get("/", verifyToken, orderController.getAllOrders);

// Get order by ID
router.get("/:id", verifyToken, orderController.getOrderById);

// Get orders by user ID
router.get("/user/:userId", verifyToken, orderController.getOrdersByUserId);

// Update order status (admin only)
router.put("/:id/status", verifyToken, orderController.updateOrderStatus);

export { router as orderRouter };