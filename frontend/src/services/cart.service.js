import { api } from './api.js';

export const cartService = {
  getCart: () => api.get('/cart'),

  addToCart: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),

  updateQuantity: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),

  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),

  clearCart: () => api.delete('/cart'),
};
