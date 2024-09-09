const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @desc    Get all products (Admin Only)
// @route   GET /api/products/all
// @access  Admin-Only
const getProducts = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({
      auth: "Failed",
      message: "Action Forbidden",
    });
    return;
  }

  const products = await Product.find({});
  res.json(products);
});

// @desc    Create a new product (Admin Only)
// @route   POST /api/products/
// @access  Admin-Only
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || "Sample Name",
    description: req.body.description || "Sample Description",
    price: req.body.price || 0,
    isActive: true,
    createdOn: new Date(),
  });
  const createdProduct = await product.save();

  res.status(201).json({
    name: createdProduct.name,
    description: createdProduct.description,
    price: createdProduct.price,
    isActive: createdProduct.isActive,
    _id: createdProduct._id,
    createdOn: createdProduct.createdOn,
    __v: createdProduct.__v,
  });
});

// @desc    Update a product (Admin Only)
// @route   PATCH /api/products/:productId/update
// @access  Admin-Only
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// @desc    Archive a product (Admin Only)
// @route   PATCH /api/products/:productId/archive
// @access  Admin-Only
const archiveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (product) {
    if (!product.isActive) {
      res.status(200).json({
        message: "Product already archived",
        archivedProduct: {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          isActive: product.isActive,
          createdOn: product.createdOn,
          __v: product.__v,
        },
      });
    } else {
      product.isActive = false;
      await product.save();
      res.status(200).json({
        success: true,
        message: "Product archived successfully",
      });
    }
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// @desc    Activate a product (Admin Only)
// @route   PATCH /api/products/:productId/activate
// @access  Admin-Only
const activateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (product) {
    if (product.isActive) {
      res.status(200).json({
        message: "Product already active",
        activateProduct: {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          isActive: product.isActive,
          createdOn: product.createdOn,
          __v: product.__v,
        },
      });
    } else {
      product.isActive = true;
      await product.save();

      res.status(200).json({
        success: true,
        message: "Product activated successfully",
      });
    }
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// @desc    Get all active products (Public)
// @route   GET /api/products/active
// @access  Public
const getActiveProducts = asyncHandler(async (req, res) => {
  const activeProducts = await Product.find({ isActive: true });

  res.status(200).json(
    activeProducts.map(product => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      isActive: product.isActive,
      createdOn: product.createdOn,
      v: product.v,
    }))
  );
});

// @desc    Get product by ID (Public)
// @route   GET /api/products/:productId
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (product) {
    res.status(200).json({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      isActive: product.isActive,
      createdOn: product.createdOn,
      v: product.v,
    });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

//Search products by name
const searchProductsByName = asyncHandler(async (req, res) => {
  const { name } = req.body;

  try {
    const products = await Product.find({
      name: { $regex: name, $options: 'i' }, // 'i' for case-insensitive search
      isActive: true,
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to search products by name', error: error.message });
  }
});

//Search for Products by Price Range

const searchProductsByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.body;

  try {
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
      isActive: true,
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to search products by price range', error: error.message });
  }
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  archiveProduct,
  activateProduct,
  getActiveProducts,
  getProductById,
  searchProductsByName,
  searchProductsByPrice
};
