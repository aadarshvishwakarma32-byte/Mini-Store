import { api } from './api.js';

export const catalogService = {
  getCategories: () => api.get('/catalog/categories'),
};
