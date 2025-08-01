import { Order, User, Product } from '../models/index.js';
import { sequelize } from '../database/index.js';

const getDashboardStats = async (req, res) => {
  try {
    // Total sales: sum of totalAmount from orders
    const totalSalesResult = await Order.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales']],
      raw: true,
    });
    const totalSales = totalSalesResult.totalSales || 0;

    // Total orders count
    const totalOrders = await Order.count();

    // Total customers excluding admin (assuming isAdmin boolean or role field)
    // Adjust the condition based on your User model
    const totalCustomers = await User.count({
      where: {
        isAdmin: false
      }
    });

    // Total products counts
    const totalProducts = await Product.count();

    // Product counts grouped by category
    const productCategoryCountsRaw = await Product.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['category'],
      raw: true,
    });

    // Format productCategoryCounts for frontend
    const productCategoryCounts = productCategoryCountsRaw.map(item => ({
      category: item.category,
      count: parseInt(item.count, 10)
    }));

    res.status(200).json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      productCategoryCounts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const adminController = {
  getDashboardStats,
};
