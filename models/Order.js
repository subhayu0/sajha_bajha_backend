const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  paymentMethod: {
    type: DataTypes.ENUM('cod', 'card', 'upi', 'netbanking'),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  estimatedDelivery: {
    type: DataTypes.DATE
  },
  shippedAt: {
    type: DataTypes.DATE
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  trackingNumber: {
    type: DataTypes.STRING
  },
  trackingUrl: {
    type: DataTypes.STRING
  }
}, {
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['orderNumber']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance method to generate order number
Order.generateOrderNumber = function() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SB${timestamp}${random}`;
};

// Instance method to calculate total
Order.prototype.calculateTotal = function() {
  return this.subtotal + this.taxAmount + this.shippingAmount - this.discountAmount;
};

module.exports = Order; 