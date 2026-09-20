import { api } from './api.js';

export const adminService = {
  createProduct: (data) => api.post('/products', data),

  updateProduct: (id, data) => api.put(`/products/${id}`, data),

  deleteProduct: (id) => api.delete(`/products/${id}`),

  createCategory: (data) => api.post('/products/categories', data),

  importWebCatalog: () => api.post('/admin/catalog/import', {}),

  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/users${query ? `?${query}` : ''}`);
  },

  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  getStoreSettings: () => api.get('/admin/settings'),
  updateStoreSettings: (settings) => api.put('/admin/settings', settings),
  getMonitoring: () => api.get('/admin/monitoring'),

  getAllOrders: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/orders${query ? `?${query}` : ''}`);
  },

  updateOrderStatus: (id, orderStatus) => api.put(`/orders/${id}/status`, { status: orderStatus }),
};
