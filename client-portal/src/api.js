import axios from 'axios';

const API_BASE = 'http://localhost:8002';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const auth = {
  register: (email, name, password) => api.post('/api/auth/register', { email, name, password }),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  me: () => api.get('/api/auth/me'),
};

// Orders
export const orders = {
  create: (data) => api.post('/api/orders', data),
  list: () => api.get('/api/orders'),
  get: (id) => api.get(`/api/orders/${id}`),
  cancel: (id) => api.delete(`/api/orders/${id}`),
};

// Assets
export const assets = {
  upload: (orderId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/orders/${orderId}/assets`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: (orderId) => api.get(`/api/orders/${orderId}/assets`),
  downloadUrl: (assetId) => `${API_BASE}/api/assets/${assetId}/download`,
  delete: (assetId) => api.delete(`/api/assets/${assetId}`),
};

// Jobs
export const jobs = {
  list: (orderId) => api.get(`/api/orders/${orderId}/jobs`),
  get: (jobId) => api.get(`/api/jobs/${jobId}`),
};

// Payments
export const payments = {
  createPayPal: (orderId) => api.post('/api/payments/create-intent', { order_id: orderId, provider: 'paypal' }),
  createStripe: (orderId) => api.post('/api/payments/create-intent', { order_id: orderId, provider: 'stripe' }),
};

export default api;
