import { api } from './api.js';

export const orderService = {
  createOrder: (shippingAddress, paymentMethod = 'cod') =>
    api.post('/orders', { shippingAddress, paymentMethod }),

  getOrders: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    return api.get(`/orders/my-orders${query ? `?${query}` : ''}`);
  },

  getOrder: (id) => api.get(`/orders/${id}`),

  initiatePayment: (orderId, { method, upiId, cardLast4, cardNetwork, bankCode }) =>
    api.post('/payments/initiate', { orderId, method, upiId, cardLast4, cardNetwork, bankCode }),

  verifyPayment: (merchantOrderRef) => api.post(`/payments/verify/${merchantOrderRef}`, {}),

  refundPayment: (paymentId, amount) => api.post(`/payments/refund/${paymentId}`, { amount }),

  cancelOrder: (id) => api.delete(`/orders/${id}`),
};
