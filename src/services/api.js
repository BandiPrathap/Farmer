// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: "https://farmer-tau.vercel.app",
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('farmerUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;