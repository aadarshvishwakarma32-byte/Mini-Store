// repositories/cartRepository.js
// Repository — data-access calls against the Cart collection
const Cart = require('../models/Cart');

const findByUser = (userId) =>
  Cart.findOne({ user: userId }).populate('items.product', 'title price image stock isActive');

const createForUser = (userId) => Cart.create({ user: userId, items: [] });

const save = (cartDoc) => cartDoc.save();

const deleteByUser = (userId) => Cart.findOneAndDelete({ user: userId });

module.exports = {
  findByUser,
  createForUser,
  save,
  deleteByUser,
};
