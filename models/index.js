const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// User - Order relationship (One-to-Many)
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Order - OrderItem relationship (One-to-Many)
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Product - OrderItem relationship (One-to-Many)
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
  onDelete: 'RESTRICT'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

module.exports = {
  User,
  Product,
  Order,
  OrderItem
}; 