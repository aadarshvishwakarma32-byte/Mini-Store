// utils/response.js
// Standardized API response envelope, so every endpoint returns the same shape:
// { success, message, data, error }

const success = (res, { message = 'Success', data = null, statusCode = 200 } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const created = (res, { message = 'Created', data = null } = {}) => {
  return success(res, { message, data, statusCode: 201 });
};

const error = (res, { message = 'Something went wrong', statusCode = 500, errors = null } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { success, created, error };
