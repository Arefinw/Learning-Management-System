/**
 * @fileoverview This file provides services for interacting with the project API.
 * @description It contains functions for fetching project data from the backend.
 */

import axios from 'axios';

const API_URL = '/api/projects/';

/**
 * @description Fetches all projects for a given workspace.
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of project objects.
 */
const getProjectsByWorkspace = async (workspaceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'workspace/' + workspaceId, config);
  return response.data;
};

/**
 * @description Fetches a single project by its ID.
 * @param {string} projectId - The ID of the project.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<object>} - A promise that resolves to the project object.
 */
const getProjectById = async (projectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + projectId, config);
  return response.data;
};

const projectService = {
  getProjectsByWorkspace,
  getProjectById,
};

export default projectService;
