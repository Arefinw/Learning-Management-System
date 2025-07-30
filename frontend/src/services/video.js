/**
 * @file video.js
 * @description This file contains API functions for video-related operations.
 * @module services/video
 * @requires ./api
 */

import api from './api';

/**
 * @function createVideo
 * @description Creates a new video.
 * @param {object} videoData - The data for the new video.
 * @returns {Promise<object>} The response data.
 */
export const createVideo = async (videoData) => {
  const res = await api.post('/videos', videoData);
  return res.data;
};

/**
 * @function getVideoById
 * @description Fetches a single video by its ID.
 * @param {string} id - The ID of the video.
 * @returns {Promise<object>} The response data.
 */
export const getVideoById = async (id) => {
  const res = await api.get(`/videos/${id}`);
  return res.data;
};

/**
 * @function updateVideo
 * @description Updates a video.
 * @param {string} id - The ID of the video to update.
 * @param {object} videoData - The new data for the video.
 * @returns {Promise<object>} The response data.
 */
export const updateVideo = async (id, videoData) => {
  const res = await api.put(`/videos/${id}`, videoData);
  return res.data;
};

/**
 * @function deleteVideo
 * @description Deletes a video.
 * @param {string} id - The ID of the video to delete.
 * @returns {Promise<object>} The response data.
 */
export const deleteVideo = async (id) => {
  const res = await api.delete(`/videos/${id}`);
  return res.data;
};
