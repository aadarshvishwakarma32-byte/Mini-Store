// services/userService.js
// Service — business logic for managing users (profile + admin user management)
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateProfile = async (userId, updates) => {
  // Prevent privilege escalation / unwanted field updates via profile endpoint
  const { name, phone, address } = updates;
  const user = await userRepository.updateById(userId, { name, phone, address });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const listUsers = async ({ page = 1, limit = 20 } = {}) => {
  // page/limit arrive as strings from req.query — coerce to safe integers
  // before doing arithmetic or handing them to Mongoose's skip()/limit().
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    userRepository.findAll({ skip, limit: limitNum }),
    userRepository.count(),
  ]);
  return { users, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateUserRole = async (userId, role) => {
  if (!['user', 'admin'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }
  const user = await userRepository.updateById(userId, { role });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const setUserActiveStatus = async (userId, isActive) => {
  const user = await userRepository.updateById(userId, { isActive });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const deleteUser = async (userId) => {
  const user = await userRepository.deleteById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = {
  getProfile,
  updateProfile,
  listUsers,
  getUserById,
  updateUserRole,
  setUserActiveStatus,
  deleteUser,
};
