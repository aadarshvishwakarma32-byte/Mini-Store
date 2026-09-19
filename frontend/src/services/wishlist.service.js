import { api } from './api.js';

export const wishlistService = {
  getWishlist: () =>
    api.get('/wishlist'),

  addToWishlist: (productId) =>
    api.post('/wishlist', { productId }),

  removeFromWishlist: (productId) =>
    api.delete(`/wishlist/${productId}`)
};
