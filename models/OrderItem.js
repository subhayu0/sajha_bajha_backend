const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productImage: {
    type: DataTypes.STRING
  },
  productSku: {
    type: DataTypes.STRING
  }
}, {
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['productId']
    }
  ]
});

// Instance method to calculate total price
OrderItem.prototype.calculateTotal = function() {
  return this.quantity * this.unitPrice;
};

module.exports = OrderItem; 