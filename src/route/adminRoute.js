import express from 'express';
import { adminController } from '../controller/adminController.js';
import { authenticateToken } from '../middleware/token-middleware.js';

const router = express.Router();

// Route to get dashboard stats, protected and admin only
router.get('/dashboard/stats', authenticateToken, adminController.getDashboardStats);

export default router;