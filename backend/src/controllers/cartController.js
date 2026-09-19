// controllers/cartController.js
// Controller — shopping cart endpoints (always scoped to req.user, the logged-in user)
const cartService = require('../services/cartService');
const response = require('../utils/response');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    return response.success(res, { data: cart });
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return response.error(res, { message: 'productId is required', statusCode: 400 });
    }
    const cart = await cartService.addItem(req.user.id, { productId, quantity });
    return response.success(res, { message: 'Item added to cart', data: cart });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateItemQuantity(req.user.id, req.params.productId, quantity);
    return response.success(res, { message: 'Cart updated', data: cart });
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.productId);
    return response.success(res, { message: 'Item removed from cart', data: cart });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    return response.success(res, { message: 'Cart cleared', data: cart });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
