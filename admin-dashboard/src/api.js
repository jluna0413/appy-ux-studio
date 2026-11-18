import axios from 'axios';

const API_BASE = 'http://localhost:8002';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  me: () => api.get('/api/auth/me'),
};

export const admin = {
  orders: (status, serviceType) => api.get('/api/admin/orders', { params: { status, service_type: serviceType } }),
  users: () => api.get('/api/admin/users'),
  stats: () => api.get('/api/admin/stats'),
  jobs: (status) => api.get('/api/admin/jobs', { params: { status } }),
  approveInputs: (id) => api.post(`/api/admin/orders/${id}/approve-inputs`),
  approve: (id) => api.post(`/api/admin/orders/${id}/approve`),
  deliver: (id) => api.post(`/api/admin/orders/${id}/deliver`),
  comfyuiStatus: () => api.get('/api/admin/comfyui/status'),
  // Shop
  shopStats: () => api.get('/api/shop/admin/stats'),
  products: () => api.get('/api/shop/products'),
  createProduct: (data) => api.post('/api/shop/admin/products', data),
  updateProduct: (id, data) => api.patch(`/api/shop/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/shop/admin/products/${id}`),
  // Channels
  channels: () => api.get('/api/channels'),
  channelStats: () => api.get('/api/channels/stats'),
  platformOrders: (channel, status) => api.get('/api/channels/platform-orders', { params: { channel_name: channel, sync_status: status } }),
  webhooks: (channel, processed) => api.get('/api/channels/webhooks', { params: { channel_name: channel, processed } }),
};

export const orders = {
  get: (id) => api.get(`/api/orders/${id}`),
  update: (id, data) => api.patch(`/api/orders/${id}`, data),
};

export const jobs = {
  retry: (id) => api.post(`/api/jobs/${id}/retry`),
};

export default api;
