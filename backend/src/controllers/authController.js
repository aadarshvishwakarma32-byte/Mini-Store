// controllers/authController.js
// Controller — like a Java @RestController. Thin layer: parse request, call
// service, format response. No business logic lives here.
const authService = require('../services/authService');
const response = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return response.error(res, {
        message: 'name, email and password are required',
        statusCode: 400,
      });
    }

    const result = await authService.register({ name, email, password, phone, address });
    return response.created(res, { message: 'Registered successfully', data: result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response.error(res, { message: 'email and password are required', statusCode: 400 });
    }

    const result = await authService.login({ email, password });
    return response.success(res, { message: 'Logged in successfully', data: result });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return response.error(res, {
        message: 'currentPassword and newPassword are required',
        statusCode: 400,
      });
    }

    const result = await authService.changePassword(req.user.id, { currentPassword, newPassword });
    return response.success(res, { message: result.message });
  } catch (err) {
    next(err);
  }
};

// With a stateless JWT, "logout" is handled client-side by discarding the token.
// This endpoint exists for API symmetry / future token-blacklist support.
const logout = async (req, res) => {
  return response.success(res, { message: 'Logged out successfully' });
};

const forgotPassword = async (req, res, next) => {
  try {
    const reset = await authService.requestPasswordReset(req.body.email || '');
    // Expose the link only during local development, where no email provider
    // is configured. Production always returns the same generic response.
    const data =
      process.env.NODE_ENV === 'production' || !reset
        ? null
        : { resetToken: reset.token, resetUrl: reset.resetUrl };
    return response.success(res, {
      message: 'If that email exists, a reset link has been generated',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const validateResetToken = async (req, res, next) => {
  try {
    const user = await authService.validatePasswordResetToken(req.params.token);
    if (!user)
      return response.error(res, {
        message: 'Password reset token is invalid or has expired',
        statusCode: 400,
      });
    return response.success(res, { message: 'Password reset token is valid' });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    return response.success(res, { message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  changePassword,
  logout,
  forgotPassword,
  validateResetToken,
  resetPassword,
};
