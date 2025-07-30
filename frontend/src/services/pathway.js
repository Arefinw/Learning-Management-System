/**
 * @file pathway.js
 * @description This file contains API functions for pathway-related operations.
 * @module services/pathway
 * @requires ./api
 */

import api from './api';

/**
 * @function getPathways
 * @description Fetches all pathways for a given project.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<object>} The response data.
 */
export const getPathways = async (projectId) => {
  const res = await api.get(`/pathways?project=${projectId}`);
  return res.data;
};

/**
 * @function createPathway
 * @description Creates a new pathway.
 * @param {object} pathwayData - The data for the new pathway.
 * @returns {Promise<object>} The response data.
 */
export const createPathway = async (pathwayData) => {
  const res = await api.post('/pathways', pathwayData);
  return res.data;
};

/**
 * @function getPathwayById
 * @description Fetches a single pathway by its ID.
 * @param {string} id - The ID of the pathway.
 * @returns {Promise<object>} The response data.
 */
export const getPathwayById = async (id) => {
  const res = await api.get(`/pathways/${id}`);
  return res.data;
};

/**
 * @function updatePathway
 * @description Updates a pathway.
 * @param {string} id - The ID of the pathway to update.
 * @param {object} pathwayData - The new data for the pathway.
 * @returns {Promise<object>} The response data.
 */
export const updatePathway = async (id, pathwayData) => {
  const res = await api.put(`/pathways/${id}`, pathwayData);
  return res.data;
};

/**
 * @function deletePathway
 * @description Deletes a pathway.
 * @param {string} id - The ID of the pathway to delete.
 * @returns {Promise<object>} The response data.
 */
export const deletePathway = async (id) => {
  const res = await api.delete(`/pathways/${id}`);
  return res.data;
};

/**
 * @function addPathwayItem
 * @description Adds an item to a pathway.
 * @param {string} id - The ID of the pathway.
 * @param {object} itemData - The data for the new item.
 * @returns {Promise<object>} The response data.
 */
export const addPathwayItem = async (id, itemData) => {
  const res = await api.post(`/pathways/${id}/items`, itemData);
  return res.data;
};