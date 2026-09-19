// repositories/userRepository.js
// Repository — like a Java Spring Data JPA repository. No business logic here,
// just data-access calls against the User collection.
const User = require('../models/User');

const create = (userData) => User.create(userData);

const findById = (id) => User.findById(id);

const findByIdWithPassword = (id) => User.findById(id).select('+password');

const findByEmail = (email) => User.findOne({ email: email.toLowerCase() });

const findByEmailWithPassword = (email) =>
  User.findOne({ email: email.toLowerCase() }).select('+password');

const findAll = ({ filter = {}, skip = 0, limit = 20 } = {}) =>
  User.find(filter).skip(Number(skip)).limit(Number(limit)).sort({ createdAt: -1 });

const count = (filter = {}) => User.countDocuments(filter);

const updateById = (id, updates) =>
  User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const deleteById = (id) => User.findByIdAndDelete(id);

const existsByEmail = (email) => User.exists({ email: email.toLowerCase() });

module.exports = {
  create,
  findById,
  findByIdWithPassword,
  findByEmail,
  findByEmailWithPassword,
  findAll,
  count,
  updateById,
  deleteById,
  existsByEmail,
};
