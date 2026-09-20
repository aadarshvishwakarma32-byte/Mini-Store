import { api } from './api.js';

export const reviewService = {
  getReviews: (productId, params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/reviews/${productId}${query ? `?${query}` : ''}`);
  },

  createReview: (productId, data) => api.post(`/reviews/${productId}`, data),

  updateReview: (id, data) => api.put(`/reviews/${id}`, data),

  deleteReview: (id) => api.delete(`/reviews/${id}`),
};
