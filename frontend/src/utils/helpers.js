/**
 * @file helpers.js
 * @description This file contains helper functions for the application.
 * @module utils/helpers
 */

/**
 * @function formatDuration
 * @description Formats a duration in seconds into a string (e.g., "mm:ss").
 * @param {number} seconds - The duration in seconds.
 * @returns {string} The formatted duration string.
 */
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};