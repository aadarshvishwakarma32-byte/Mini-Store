// services/cartService.js
// Service — business logic for the shopping cart
const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const AppError = require('../utils/AppError');

const getOrCreateCart = async (userId) => {
  let cart = await cartRepository.findByUser(userId);
  if (!cart) {
    cart = await cartRepository.createForUser(userId);
  }
  return cart;
};

const getCart = async (userId) => {
  return getOrCreateCart(userId);
};

const addItem = async (userId, { productId, quantity }) => {
  if (!productId) throw new AppError('productId is required', 400);

  // quantity defaults to 1 when omitted, but any other value must be a
  // real finite number — otherwise it silently becomes NaN and corrupts
  // the cart item on save.
  const qty = quantity === undefined ? 1 : Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    throw new AppError('Quantity must be a number of at least 1', 400);
  }

  const product = await productRepository.findById(productId);
  if (!product || !product.isActive) throw new AppError('Product not found', 404);

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find((item) => (item.product._id
    ? item.product._id.toString() === productId
    : item.product.toString() === productId));

  // Stock must cover the TOTAL quantity that will end up in the cart
  // (existing + new), not just the newly-added amount.
  const totalQuantity = existingItem ? existingItem.quantity + qty : qty;
  if (product.stock < totalQuantity) throw new AppError('Not enough stock available', 400);

  if (existingItem) {
    existingItem.quantity = totalQuantity;
  } else {
    cart.items.push({ product: productId, quantity: qty, priceAtAddTime: product.price });
  }

  await cartRepository.save(cart);
  return cartRepository.findByUser(userId);
};

const updateItemQuantity = async (userId, productId, quantity) => {
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) {
    throw new AppError('Quantity must be a number of at least 1', 400);
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => (i.product._id ? i.product._id.toString() : i.product.toString()) === productId);

  if (!item) throw new AppError('Item not found in cart', 404);

  const product = await productRepository.findById(productId);
  if (product && product.stock < qty) throw new AppError('Not enough stock available', 400);

  item.quantity = qty;
  await cartRepository.save(cart);
  return cartRepository.findByUser(userId);
};

const removeItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter(
    (i) => (i.product._id ? i.product._id.toString() : i.product.toString()) !== productId
  );
  await cartRepository.save(cart);
  return cartRepository.findByUser(userId);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cartRepository.save(cart);
  return cart;
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
};
