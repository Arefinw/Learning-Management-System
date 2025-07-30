/**
 * @file api.js
 * @description This file configures the Axios instance for making API requests.
 * It sets the base URL and includes interceptors for handling tokens and errors.
 * @module services/api
 * @requires axios
 */

import axios from 'axios';


const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('API Request Interceptor: Token attached to request', config.url);
    } else {
      console.log('API Request Interceptor: No token found for request', config.url);
    }
    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response Interceptor: Request successful', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log('API Response Interceptor Error:', error.response?.status, error.config?.url, error.response?.data);
    // if (error.response.status === 401) {
    //   console.error('Session expired or unauthorized. Please log in again.');
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default api;