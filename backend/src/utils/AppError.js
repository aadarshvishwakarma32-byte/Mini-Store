// utils/AppError.js
// Custom application error — carries an HTTP status code so errorMiddleware
// can translate it directly into a response. Like a Java custom RuntimeException.
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
