// repositories/categoryRepository.js
// Repository — data-access calls against the Category collection
const Category = require('../models/Category');

const create = (categoryData) => Category.create(categoryData);

const findById = (id) => Category.findById(id);

const findBySlug = (slug) => Category.findOne({ slug });

const findByName = (name) => Category.findOne({ name: new RegExp(`^${name}$`, 'i') });

const findAll = (filter = {}) => Category.find(filter).sort({ name: 1 });

const updateById = (id, updates) =>
  Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const deleteById = (id) => Category.findByIdAndDelete(id);

module.exports = {
  create,
  findById,
  findBySlug,
  findByName,
  findAll,
  updateById,
  deleteById,
};
