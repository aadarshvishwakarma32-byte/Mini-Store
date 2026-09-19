// utils/password.js
// Password hashing helpers using bcrypt
const bcrypt = require('bcryptjs');
const environment = require('../config/environment');

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(environment.BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
