import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const fetchFarmers = (page = 1) => api.get(`/farmers?page=${page}`);
export const createCropType = (data) => api.post('/crop-types', data);
export const updateCropStatus = (id, data) => api.post(`/crops/${id}`, data);
// Add all API calls here