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
  const res = await api.get(`api/workspaces/${id}`);
  console.log("response blah blah: ", res);
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

/**
 * @function removeWorkspaceMember
 * @description Removes a member from a workspace.
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} memberId - The ID of the member to remove.
 * @returns {Promise<object>} The response data.
 */
export const removeWorkspaceMember = async (workspaceId, memberId) => {
  const res = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  return res.data;
};

/**
 * @function updateWorkspaceMemberRole
 * @description Updates a member's role in a workspace.
 * @param {string} workspaceId - The ID of the workspace.
 * @param {string} memberId - The ID of the member to update.
 * @param {object} roleData - The new role data.
 * @returns {Promise<object>} The response data.
 */
export const updateWorkspaceMemberRole = async (workspaceId, memberId, roleData) => {
  const res = await api.put(`/workspaces/${workspaceId}/members/${memberId}`, roleData);
  return res.data;
};