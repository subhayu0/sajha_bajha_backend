// controllers/productController.js
const Product = require("../model/productSchema");

// CREATE
const createProduct = async (req, res) => {
  const { productName, productPrice, productDescription } = req.body;
  try {
    const newProduct = await Product.create({
      productName,
      productPrice,
      productDescription,
    });
    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// READ
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// READ single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.update(updates);
    res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
