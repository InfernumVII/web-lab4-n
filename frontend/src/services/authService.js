import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  login: (username, password) =>
    apiClient.post('/auth/login', { username, password }),

  register: (username, password) =>
    apiClient.post('/auth/register', { username, password }),

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return apiClient.post('/auth/logout');
  },

  verifyToken: (token) =>
    apiClient.post('/auth/verify', {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default apiClient;