/**
 * @file document.js
 * @description This file contains API functions for document-related operations.
 * @module services/document
 * @requires ./api
 */

import api from './api';

/**
 * @function createDocument
 * @description Creates a new document.
 * @param {object} documentData - The data for the new document.
 * @returns {Promise<object>} The response data.
 */
export const createDocument = async (documentData) => {
  const res = await api.post('/documents', documentData);
  return res.data;
};

/**
 * @function getDocumentById
 * @description Fetches a single document by its ID.
 * @param {string} id - The ID of the document.
 * @returns {Promise<object>} The response data.
 */
export const getDocumentById = async (id) => {
  const res = await api.get(`/documents/${id}`);
  return res.data;
};

/**
 * @function updateDocument
 * @description Updates a document.
 * @param {string} id - The ID of the document to update.
 * @param {object} documentData - The new data for the document.
 * @returns {Promise<object>} The response data.
 */
export const updateDocument = async (id, documentData) => {
  const res = await api.put(`/documents/${id}`, documentData);
  return res.data;
};

/**
 * @function deleteDocument
 * @description Deletes a document.
 * @param {string} id - The ID of the document to delete.
 * @returns {Promise<object>} The response data.
 */
export const deleteDocument = async (id) => {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
};
