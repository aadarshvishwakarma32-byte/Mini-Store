// middleware/adminMiddleware.js
// Role-based access guard — like @PreAuthorize("hasRole('ADMIN')") in Spring.
// Must run AFTER authMiddleware.protect, since it relies on req.user being set.
const AppError = require('../utils/AppError');

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authorized, please log in', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied: admin privileges required', 403));
  }

  next();
};

module.exports = { adminOnly };
