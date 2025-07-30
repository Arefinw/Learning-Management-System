/**
 * @file workspace.js
 * @description This file contains API functions for workspace-related operations.
 * @module services/workspace
 * @requires ./api
 */

import api from './api';

/**
 * @function getWorkspaces
 * @description Fetches all workspaces.
 * @returns {Promise<object>} The response data.
 */
export const getWorkspaces = async () => {
  const res = await api.get('/workspaces');
  return res.data;
};

/**
 * @function createWorkspace
 * @description Creates a new workspace.
 * @param {object} workspaceData - The data for the new workspace.
 * @returns {Promise<object>} The response data.
 */
export const createWorkspace = async (workspaceData) => {
  const res = await api.post('/workspaces', workspaceData);
  return res.data;
};

/**
 * @function getWorkspaceById
 * @description Fetches a single workspace by its ID.
 * @param {string} id - The ID of the workspace.
 * @returns {Promise<object>} The response data.
 */
export const getWorkspaceById = async (id) => {
  const res = await api.get(`/workspaces/${id}`);
  return res.data;
};

/**
 * @function updateWorkspace
 * @description Updates a workspace.
 * @param {string} id - The ID of the workspace to update.
 * @param {object} workspaceData - The new data for the workspace.
 * @returns {Promise<object>} The response data.
 */
export const updateWorkspace = async (id, workspaceData) => {
  const res = await api.put(`/workspaces/${id}`, workspaceData);
  return res.data;
};

/**
 * @function deleteWorkspace
 * @description Deletes a workspace.
 * @param {string} id - The ID of the workspace to delete.
 * @returns {Promise<object>} The response data.
 */
export const deleteWorkspace = async (id) => {
  const res = await api.delete(`/workspaces/${id}`);
  return res.data;
};

/**
 * @function addWorkspaceMember
 * @description Adds a member to a workspace.
 * @param {string} id - The ID of the workspace.
 * @param {object} memberData - The data for the new member.
 * @returns {Promise<object>} The response data.
 */
export const addWorkspaceMember = async (id, memberData) => {
  const res = await api.post(`/workspaces/${id}/members`, memberData);
  return res.data;
};