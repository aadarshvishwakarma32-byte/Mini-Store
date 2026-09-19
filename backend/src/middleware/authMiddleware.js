// middleware/authMiddleware.js
// Like a Spring Security JWT filter — verifies the Authorization header
// and attaches the decoded user info to req.user for downstream handlers.
const { verifyToken } = require('../utils/jwt');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authorized, no token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('User belonging to this token no longer exists', 401);
    }
    if (!user.isActive) {
      throw new AppError('This account has been deactivated', 403);
    }

    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Not authorized, invalid or expired token', 401));
    }
    next(err);
  }
};

module.exports = { protect };
