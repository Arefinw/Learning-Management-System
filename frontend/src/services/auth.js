/**
 * @file auth.js
 * @description This file contains API functions for user authentication.
 * @module services/auth
 * @requires ./api
 */

import api from './api';

/**
 * @function registerUser
 * @description Registers a new user.
 * @param {object} userData - The user's registration data.
 * @returns {Promise<object>} The response data.
 */
export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

/**
 * @function loginUser
 * @description Logs in a user.
 * @param {object} userData - The user's login data.
 * @returns {Promise<object>} The response data.
 */
export const loginUser = async (userData) => {
  const res = await api.post('/auth/login', userData);
  return res.data;
};

/**
 * @function getMe
 * @description Fetches the current user's data.
 * @returns {Promise<object>} The response data.
 */
export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};