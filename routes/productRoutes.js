const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Public routes
router.get('/products', productController.getProducts);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products/categories', productController.getCategories);
router.get('/products/brands', productController.getBrands);

// Admin routes
router.post('/products', authenticateToken, requireAdmin, upload.array('images', 5), productController.createProduct);
router.put('/products/:id', authenticateToken, requireAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/products/:id', authenticateToken, requireAdmin, productController.deleteProduct);
router.put('/products/:id/stock', authenticateToken, requireAdmin, productController.updateStock);

module.exports = router; 