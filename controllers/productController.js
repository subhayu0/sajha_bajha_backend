const { Product } = require('../models');
const { uploadImage, uploadMultipleImages, deleteImage } = require('../config/cloudinary');
const { Op } = require('sequelize');

// Get all products with pagination and filters
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      isActive = true
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive };

    // Add filters
    if (category) {
      whereClause.category = category;
    }

    if (brand) {
      whereClause.brand = { [Op.iLike]: `%${brand}%` };
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Validate sort parameters
    const allowedSortFields = ['name', 'price', 'rating', 'createdAt', 'stockQuantity'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.findAll({
      where: {
        isActive: true,
        isFeatured: true
      },
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not available'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      model,
      stockQuantity,
      specifications,
      isFeatured,
      sku
    } = req.body;

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadResults = await uploadMultipleImages(
          req.files.map(file => file.path),
          'products'
        );
        images = uploadResults.map(result => result.url);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload images'
        });
      }
    }

    // Generate SKU if not provided
    const finalSku = sku || `SB-${category.toUpperCase()}-${Date.now()}`;

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      model,
      stockQuantity,
      images,
      specifications: specifications ? JSON.parse(specifications) : {},
      isFeatured: isFeatured === 'true',
      sku: finalSku
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle image uploads if new images are provided
    if (req.files && req.files.length > 0) {
      try {
        const uploadResults = await uploadMultipleImages(
          req.files.map(file => file.path),
          'products'
        );
        const newImages = uploadResults.map(result => result.url);
        
        // Combine existing and new images
        updateData.images = [...(product.images || []), ...newImages];
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload images'
        });
      }
    }

    // Parse specifications if provided
    if (updateData.specifications) {
      updateData.specifications = JSON.parse(updateData.specifications);
    }

    // Convert boolean strings to actual booleans
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true';
    }

    await product.update(updateData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        for (const imageUrl of product.images) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await deleteImage(publicId);
        }
      } catch (deleteError) {
        console.error('Image deletion error:', deleteError);
      }
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

// Get product categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category']
    });

    const categoryList = categories.map(cat => cat.category);

    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// Get product brands
const getBrands = async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: ['brand'],
      where: { isActive: true },
      group: ['brand']
    });

    const brandList = brands.map(brand => brand.brand);

    res.json({
      success: true,
      data: brandList
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands'
    });
  }
};

// Update product stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update({ stockQuantity });

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: { stockQuantity: product.stockQuantity }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  updateStock
}; 