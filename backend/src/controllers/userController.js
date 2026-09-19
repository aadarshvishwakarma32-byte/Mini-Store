// controllers/userController.js
// Controller — profile self-service + admin user management endpoints
const userService = require('../services/userService');
const response = require('../utils/response');

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return response.success(res, { data: user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return response.success(res, { message: 'Profile updated', data: user });
  } catch (err) {
    next(err);
  }
};

// --- Admin endpoints ---

const listUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await userService.listUsers({ page, limit });
    return response.success(res, { data: result });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return response.success(res, { data: user });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    return response.success(res, { message: 'User role updated', data: user });
  } catch (err) {
    next(err);
  }
};

const setUserActiveStatus = async (req, res, next) => {
  try {
    const user = await userService.setUserActiveStatus(req.params.id, req.body.isActive);
    return response.success(res, { message: 'User status updated', data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return response.success(res, { message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  listUsers,
  getUserById,
  updateUserRole,
  setUserActiveStatus,
  deleteUser,
};
