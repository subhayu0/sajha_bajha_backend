import { Product } from "../../models/Product.js";

/**
 * Get all products, optionally filtered by category
 */
const getAll = async (req, res) => {
  try {
    const category = req.query.category;
    let products;
    if (category) {
      products = await Product.findAll({ where: { category } });
    } else {
      products = await Product.findAll();
    }
    res.status(200).send({ data: products, message: "Successfully fetched products" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/**
 * Create a new product
 */
const create = async (req, res) => {
  try {
    const body = req.body;
    console.log('=== BACKEND: Creating product ===');
    console.log('Received body:', body);
    console.log('Category received:', body.category);

    // Handle uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    } else if (body.imageUrls) {
      // fallback for manual or API uploads
      imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls : [body.imageUrls];
    }

    if (
      !body.sku ||
      !body.productName ||
      !body.category ||
      !body.price ||
      !body.quantity ||
      !body.status
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const product = await Product.create({
      sku: body.sku,
      productName: body.productName,
      size: body.size,
      color: body.color,
      category: body.category,
      price: body.price,
      quantity: body.quantity,
      status: body.status,
      imageUrls,
    });

    console.log('=== BACKEND: Product created successfully ===');
    console.log('Created product:', product.toJSON());

    res.status(201).send({ data: product, message: "Product created successfully" });
  } catch (e) {
    console.error('=== BACKEND: Error creating product ===', e);
    
    // Check for duplicate SKU error
    if (e.name === 'SequelizeUniqueConstraintError' && e.errors && e.errors[0].path === 'sku') {
      return res.status(400).json({ error: "A product with this SKU already exists. Please use a unique SKU." });
    }
    
    res.status(500).json({ error: "Failed to create product" });
  }
};

/**
 * Update an existing product
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Handle uploaded images
    let imageUrls = product.imageUrls || [];
    if (req.files && req.files.length > 0) {
      // Add new uploaded images to the array
      imageUrls = imageUrls.concat(req.files.map(file => `/uploads/${file.filename}`));
    }
    // Optionally, allow removing images (not implemented here)

    // Update product fields
    await product.update({
      ...body,
      imageUrls,
    });
    res.status(200).send({ data: product, message: "Product updated successfully" });
  } catch (e) {
    console.error('=== BACKEND: Error updating product ===', e);
    
    // Check for duplicate SKU error
    if (e.name === 'SequelizeUniqueConstraintError' && e.errors && e.errors[0].path === 'sku') {
      return res.status(400).json({ error: "A product with this SKU already exists. Please use a unique SKU." });
    }
    
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * Delete a product
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    await product.destroy();
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

/**
 * Get a product by ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ data: product, message: "Successfully fetched product" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const productController = {
  getAll,
  create,
  update,
  deleteById,
  getById,
};