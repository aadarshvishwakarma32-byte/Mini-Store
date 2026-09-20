// services/productService.js
// Service — business logic for the product catalog
const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');
const AppError = require('../utils/AppError');

const createProduct = async (productData) => {
  const category = await categoryRepository.findById(productData.category);
  if (!category) throw new AppError('Category not found', 404);

  return productRepository.create(productData);
};

const listProducts = async ({
  page = 1,
  limit = 20,
  category,
  minPrice,
  maxPrice,
  search,
} = {}) => {
  // page/limit arrive as strings from req.query — coerce to safe integers
  // before doing arithmetic or handing them to Mongoose's skip()/limit().
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
  const skip = (pageNum - 1) * limitNum;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    const [products, total] = await Promise.all([
      productRepository.search(search, { skip, limit: limitNum }),
      productRepository.searchCount(search),
    ]);
    return { products, total, page: pageNum, pages: Math.ceil(total / limitNum) };
  }

  const [products, total] = await Promise.all([
    productRepository.findAll({ filter, skip, limit: limitNum }),
    productRepository.count(filter),
  ]);

  return { products, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

const getProductById = async (productId) => {
  const product = await productRepository.findById(productId);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const updateProduct = async (productId, updates) => {
  if (updates.category) {
    const category = await categoryRepository.findById(updates.category);
    if (!category) throw new AppError('Category not found', 404);
  }

  const product = await productRepository.updateById(productId, updates);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const deleteProduct = async (productId) => {
  const product = await productRepository.deleteById(productId);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const getProductsByCategory = async (categoryId) => {
  return productRepository.findByCategory(categoryId);
};

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
