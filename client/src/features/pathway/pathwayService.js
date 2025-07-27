/**
 * @fileoverview This file provides services for interacting with the pathway API.
 * @description It contains functions for fetching pathway data from the backend.
 */

import axios from 'axios';

const API_URL = '/api/pathways/';

/**
 * @description Fetches all pathways for a given project.
 * @param {string} projectId - The ID of the project.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of pathway objects.
 */
const getPathwaysByProject = async (projectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'project/' + projectId, config);
  return response.data;
};

/**
 * @description Fetches a single pathway by its ID.
 * @param {string} pathwayId - The ID of the pathway.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<object>} - A promise that resolves to the pathway object.
 */
const getPathwayById = async (pathwayId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + pathwayId, config);
  return response.data;
};

const pathwayService = {
  getPathwaysByProject,
  getPathwayById,
};

export default pathwayService;
