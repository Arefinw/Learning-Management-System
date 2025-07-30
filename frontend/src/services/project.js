/**
 * @file project.js
 * @description This file contains API functions for project-related operations.
 * @module services/project
 * @requires ./api
 */

import api from './api';

/**
 * @function getProjects
 * @description Fetches all projects.
 * @returns {Promise<object>} The response data.
 */
export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data;
};

/**
 * @function createProject
 * @description Creates a new project.
 * @param {object} projectData - The data for the new project.
 * @returns {Promise<object>} The response data.
 */
export const createProject = async (projectData) => {
  const res = await api.post('/projects', projectData);
  return res.data;
};

/**
 * @function getProjectById
 * @description Fetches a single project by its ID.
 * @param {string} id - The ID of the project.
 * @returns {Promise<object>} The response data.
 */
export const getProjectById = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

/**
 * @function updateProject
 * @description Updates a project.
 * @param {string} id - The ID of the project to update.
 * @param {object} projectData - The new data for the project.
 * @returns {Promise<object>} The response data.
 */
export const updateProject = async (id, projectData) => {
  const res = await api.put(`/projects/${id}`, projectData);
  return res.data;
};

/**
 * @function deleteProject
 * @description Deletes a project.
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<object>} The response data.
 */
export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

/**
 * @function getProjectTree
 * @description Fetches the folder and pathway tree for a project.
 * @param {string} id - The ID of the project.
 * @returns {Promise<object>} The response data.
 */
export const getProjectTree = async (id) => {
  const res = await api.get(`/projects/${id}/tree`);
  return res.data;
};