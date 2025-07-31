const { Order, OrderItem, Product, User } = require('../models');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../utils/emailService');

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    } = req.body;

    const userId = req.user.id;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Calculate totals and validate stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found or unavailable`
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
        productName: product.name,
        productImage: product.images?.[0] || null,
        productSku: product.sku
      });
    }

    // Calculate taxes and shipping (simplified)
    const taxAmount = subtotal * 0.18; // 18% GST
    const shippingAmount = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
    const totalAmount = subtotal + taxAmount + shippingAmount;

    // Create order
    const order = await Order.create({
      orderNumber: Order.generateOrderNumber(),
      userId,
      subtotal,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes
    });

    // Create order items
    await OrderItem.bulkCreate(
      orderItems.map(item => ({
        ...item,
        orderId: order.id
      }))
    );

    // Update product stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await product.update({
        stockQuantity: product.stockQuantity - item.quantity
      });
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(req.user, order);
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    // Get complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'images', 'sku']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'images', 'sku', 'description']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    await order.update({ status: 'cancelled' });

    // Restore product stock
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id }
    });

    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        await product.update({
          stockQuantity: product.stockQuantity + item.quantity
        });
      }
    }

    // Send status update email
    try {
      await sendOrderStatusUpdateEmail(req.user, order);
    } catch (emailError) {
      console.error('Order status update email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.orderNumber = { [require('sequelize').Op.iLike]: `%${search}%` };
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'sku']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, trackingUrl } = req.body;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateData = { status };
    
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
      updateData.trackingNumber = trackingNumber;
      updateData.trackingUrl = trackingUrl;
    }

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    await order.update(updateData);

    // Send status update email
    try {
      await sendOrderStatusUpdateEmail(order.user, order);
    } catch (emailError) {
      console.error('Order status update email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const confirmedOrders = await Order.count({ where: { status: 'confirmed' } });
    const shippedOrders = await Order.count({ where: { status: 'shipped' } });
    const deliveredOrders = await Order.count({ where: { status: 'delivered' } });
    const cancelledOrders = await Order.count({ where: { status: 'cancelled' } });

    const totalRevenue = await Order.sum('totalAmount', {
      where: { status: { [require('sequelize').Op.in]: ['delivered', 'shipped'] } }
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue || 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
}; 