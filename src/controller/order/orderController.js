import { Order, OrderItem, User, Product } from '../../models/index.js';
import { CartItem } from '../../models/user/CartItem.js';
import { sequelize, Op } from '../../database/index.js';

/**
 * Create a new order
 */
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      userId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      state, 
      zip, 
      country, 
      paymentMethod 
    } = req.body;

    // Validate required fields
    if (!userId || !firstName || !lastName || !email || !phone || !address || !city || !state || !zip || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get cart items for the user
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }],
      transaction
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.Product.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      userId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      country,
      paymentMethod: paymentMethod || 'cod',
      status: 'Pending',
      totalAmount
    }, { transaction });

    // Create order items
    const orderItems = await Promise.all(cartItems.map(async (item) => {
      return OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price
      }, { transaction });
    }));

    // Clear the user's cart
    await CartItem.destroy({
      where: { userId },
      transaction
    });

    await transaction.commit();

    res.status(201).json({
      message: 'Order created successfully',
      data: {
        order,
        orderItems
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

/**
 * Get all orders (admin only)
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        status: { [Op.ne]: 'Cancelled' } // Exclude cancelled orders by default
      },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { 
          model: OrderItem,
          include: [{ model: Product }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error.stack);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

/**
 * Get order by ID
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { 
          model: OrderItem,
          include: [{ model: Product }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

/**
 * Get orders by user ID
 */
const getOrdersByUserId = async (req, res) => {
  try {
    // Extract userId from the decoded token structure
    const userId = req.user.user ? req.user.user.id : req.user.id;
    
    console.log('Fetching orders for userId:', userId);
    
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { 
          model: OrderItem,
          include: [{ model: Product }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

/**
 * Update order status (admin only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Extract userId from the decoded token structure
    const userId = req.user.user ? req.user.user.id : req.user.id;
    
    console.log('Updating order status for userId:', userId);

    if (!status || !['Pending', 'Shipping', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findOne({ where: { id } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Allow users to cancel their own orders
    if (status === 'Cancelled' && order.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to cancel this order.' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const orderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus
};