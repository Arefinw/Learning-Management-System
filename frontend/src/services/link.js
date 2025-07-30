/**
 * @file link.js
 * @description This file contains API functions for link-related operations.
 * @module services/link
 * @requires ./api
 */

import api from './api';

/**
 * @function createLink
 * @description Creates a new link.
 * @param {object} linkData - The data for the new link.
 * @returns {Promise<object>} The response data.
 */
export const createLink = async (linkData) => {
  const res = await api.post('/links', linkData);
  return res.data;
};

/**
 * @function getLinkById
 * @description Fetches a single link by its ID.
 * @param {string} id - The ID of the link.
 * @returns {Promise<object>} The response data.
 */
export const getLinkById = async (id) => {
  const res = await api.get(`/links/${id}`);
  return res.data;
};

/**
 * @function updateLink
 * @description Updates a link.
 * @param {string} id - The ID of the link to update.
 * @param {object} linkData - The new data for the link.
 * @returns {Promise<object>} The response data.
 */
export const updateLink = async (id, linkData) => {
  const res = await api.put(`/links/${id}`, linkData);
  return res.data;
};

/**
 * @function deleteLink
 * @description Deletes a link.
 * @param {string} id - The ID of the link to delete.
 * @returns {Promise<object>} The response data.
 */
export const deleteLink = async (id) => {
  const res = await api.delete(`/links/${id}`);
  return res.data;
};
