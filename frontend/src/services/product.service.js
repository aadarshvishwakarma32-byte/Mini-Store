import { api } from './api.js';

export const productService = {
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/products${query ? `?${query}` : ''}`);
  },

  getProduct: (id) =>
    api.get(`/products/${id}`),

  getCategories: () =>
    api.get('/products/categories'),

  getCategory: (id) =>
    api.get(`/products/category/${id}`)
};
