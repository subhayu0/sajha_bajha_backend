const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.ENUM(
      'guitar',
      'piano',
      'drums',
      'violin',
      'flute',
      'saxophone',
      'trumpet',
      'accordion',
      'harmonium',
      'tabla',
      'sitar',
      'other'
    ),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING,
    unique: true
  }
}, {
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['brand']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isFeatured']
    }
  ]
});

// Instance method to check if product is in stock
Product.prototype.isInStock = function() {
  return this.stockQuantity > 0;
};

// Instance method to get discount percentage
Product.prototype.getDiscountPercentage = function() {
  if (!this.originalPrice || this.originalPrice <= this.price) {
    return 0;
  }
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
};

module.exports = Product; 