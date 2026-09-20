const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const response = require('../utils/response');
const AppError = require('../utils/AppError');

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    return response.success(res, { data: wishlist || { user: req.user.id, products: [] } });
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return response.error(res, { message: 'productId is required', statusCode: 400 });
    }

    if (!(await Product.findById(productId))) {
      throw new AppError('Product not found', 404);
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    if (!wishlist.products.some((id) => id.toString() === productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate('products');
    return response.success(res, { message: 'Added to wishlist', data: wishlist });
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((id) => id.toString() !== req.params.productId);
      await wishlist.save();
      await wishlist.populate('products');
    }

    return response.success(res, {
      message: 'Removed from wishlist',
      data: wishlist || { products: [] },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addProduct, removeProduct };
