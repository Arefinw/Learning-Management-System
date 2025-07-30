/**
 * @file folder.js
 * @description This file contains API functions for folder-related operations.
 * @module services/folder
 * @requires ./api
 */

import api from './api';

/**
 * @function createFolder
 * @description Creates a new folder.
 * @param {object} folderData - The data for the new folder.
 * @returns {Promise<object>} The response data.
 */
export const createFolder = async (folderData) => {
  const res = await api.post('/folders', folderData);
  return res.data;
};

/**
 * @function getFolderById
 * @description Fetches a single folder by its ID.
 * @param {string} id - The ID of the folder.
 * @returns {Promise<object>} The response data.
 */
export const getFolderById = async (id) => {
  const res = await api.get(`/folders/${id}`);
  return res.data;
};

/**
 * @function updateFolder
 * @description Updates a folder.
 * @param {string} id - The ID of the folder to update.
 * @param {object} folderData - The new data for the folder.
 * @returns {Promise<object>} The response data.
 */
export const updateFolder = async (id, folderData) => {
  const res = await api.put(`/folders/${id}`, folderData);
  return res.data;
};

/**
 * @function deleteFolder
 * @description Deletes a folder.
 * @param {string} id - The ID of the folder to delete.
 * @returns {Promise<object>} The response data.
 */
export const deleteFolder = async (id) => {
  const res = await api.delete(`/folders/${id}`);
  return res.data;
};
