const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// User routes
router.post('/orders', authenticateToken, orderController.createOrder);
router.get('/orders', authenticateToken, orderController.getUserOrders);
router.get('/orders/:id', authenticateToken, orderController.getOrderById);
router.put('/orders/:id/cancel', authenticateToken, orderController.cancelOrder);

// Admin routes
router.get('/admin/orders', authenticateToken, requireAdmin, orderController.getAllOrders);
router.put('/admin/orders/:id/status', authenticateToken, requireAdmin, orderController.updateOrderStatus);
router.get('/admin/orders/stats', authenticateToken, requireAdmin, orderController.getOrderStats);

module.exports = router; 