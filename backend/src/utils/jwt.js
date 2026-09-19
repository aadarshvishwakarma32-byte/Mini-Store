// utils/jwt.js
// JSON Web Token helpers — sign & verify access tokens
const jwt = require('jsonwebtoken');
const environment = require('../config/environment');

/**
 * Generate a signed JWT for a given payload (usually { id, role }).
 */
const generateToken = (payload) => {
  return jwt.sign(payload, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT and return its decoded payload.
 * Throws if invalid/expired — caller (middleware) should catch it.
 */
const verifyToken = (token) => {
  return jwt.verify(token, environment.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
