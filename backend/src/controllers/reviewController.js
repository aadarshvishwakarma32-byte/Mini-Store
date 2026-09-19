const Review = require('../models/Review');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const response = require('../utils/response');

const refreshProductRating = async (productId) => {
  const [stats] = await Review.aggregate([{ $match: { product: Product.db.base.Types.ObjectId.createFromHexString(String(productId)) } }, { $group: { _id: null, rate: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  await Product.findByIdAndUpdate(productId, { rating: { rate: stats?.rate || 0, count: stats?.count || 0 } });
};

const list = async (req, res, next) => { try {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
  return response.success(res, { data: reviews });
} catch (error) { next(error); } };
const create = async (req, res, next) => { try {
  if (!await Product.exists({ _id: req.params.productId })) throw new AppError('Product not found', 404);
  const review = await Review.create({ product: req.params.productId, user: req.user.id, rating: req.body.rating, comment: req.body.comment });
  await refreshProductRating(req.params.productId);
  return response.created(res, { message: 'Review created', data: review });
} catch (error) { next(error); } };
const update = async (req, res, next) => { try {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') throw new AppError('Not authorized to edit this review', 403);
  if (req.body.rating !== undefined) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;
  await review.save(); await refreshProductRating(review.product);
  return response.success(res, { message: 'Review updated', data: review });
} catch (error) { next(error); } };
const remove = async (req, res, next) => { try {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') throw new AppError('Not authorized to delete this review', 403);
  await review.deleteOne(); await refreshProductRating(review.product);
  return response.success(res, { message: 'Review deleted' });
} catch (error) { next(error); } };
module.exports = { list, create, update, remove };
