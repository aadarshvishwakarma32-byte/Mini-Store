// repositories/productRepository.js
// Repository — data-access calls against the Product collection
const Product = require('../models/Product');

const create = (productData) => Product.create(productData);

const findById = (id) => Product.findById(id).populate('category', 'name slug');

const findAll = ({ filter = {}, skip = 0, limit = 20, sort = { createdAt: -1 } } = {}) =>
  Product.find(filter)
    .populate('category', 'name slug')
    .skip(Number(skip))
    .limit(Number(limit))
    .sort(sort);

const count = (filter = {}) => Product.countDocuments(filter);

const updateById = (id, updates) =>
  Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const deleteById = (id) => Product.findByIdAndDelete(id);

const findByCategory = (categoryId) => Product.find({ category: categoryId, isActive: true });

const decrementStock = (id, quantity) =>
  Product.findOneAndUpdate(
    { _id: id, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true }
  );

const incrementStock = (id, quantity) =>
  Product.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true, runValidators: true });

const search = (query, { skip = 0, limit = 20 } = {}) =>
  Product.find({ $text: { $search: query }, isActive: true })
    .populate('category', 'name slug')
    .skip(Number(skip))
    .limit(Number(limit));

const searchCount = (query) =>
  Product.countDocuments({ $text: { $search: query }, isActive: true });

module.exports = {
  create,
  findById,
  findAll,
  count,
  updateById,
  deleteById,
  findByCategory,
  decrementStock,
  incrementStock,
  search,
  searchCount,
};
