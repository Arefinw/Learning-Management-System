/**
 * @file user.js
 * @description This file contains API functions for user-related operations.
 * @module services/user
 * @requires ./api
 */

import api from './api';

/**
 * @function getUsers
 * @description Fetches all users.
 * @returns {Promise<object>} The response data.
 */
export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

/**
 * @function getUserById
 * @description Fetches a single user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {Promise<object>} The response data.
 */
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

/**
 * @function updateUser
 * @description Updates a user.
 * @param {string} id - The ID of the user to update.
 * @param {object} userData - The new data for the user.
 * @returns {Promise<object>} The response data.
 */
export const updateUser = async (id, userData) => {
  const res = await api.put(`/users/${id}`, userData);
  return res.data;
};