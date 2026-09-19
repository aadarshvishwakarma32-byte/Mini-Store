const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const response = require('../utils/response');
const AppError = require('../utils/AppError');

const getWishlist = async (req, res, next) => { try { const w = await Wishlist.findOne({ user: req.user.id }).populate('products'); return response.success(res,{data:w || {user:req.user.id,products:[]}}); } catch(e){next(e);} };
const addProduct = async (req,res,next)=>{try{const {productId}=req.body;if(!productId)return response.error(res,{message:'productId is required',statusCode:400});if(!await Product.findById(productId))throw new AppError('Product not found',404);let w=await Wishlist.findOne({user:req.user.id});if(!w)w=await Wishlist.create({user:req.user.id,products:[]});if(!w.products.some(id=>id.toString()===productId))w.products.push(productId);await w.save();await w.populate('products');return response.success(res,{message:'Added to wishlist',data:w});}catch(e){next(e);}};
const removeProduct = async(req,res,next)=>{try{let w=await Wishlist.findOne({user:req.user.id});if(w){w.products=w.products.filter(id=>id.toString()!==req.params.productId);await w.save();await w.populate('products');}return response.success(res,{message:'Removed from wishlist',data:w||{products:[]}});}catch(e){next(e);}};
module.exports={getWishlist,addProduct,removeProduct};
