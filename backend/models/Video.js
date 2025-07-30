/**
 * @file Video.js
 * @description Defines the Mongoose schema for the Video model.
 * @module models/Video
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @schema videoSchema
 * @description Mongoose schema for videos.
 * @property {String} title - The title of the video. (Required)
 * @property {String} url - The URL of the video. (Required)
 * @property {String} description - A description of the video.
 * @property {Number} duration - The duration of the video in seconds.
 * @property {String} thumbnail - The URL of the video thumbnail.
 * @property {Date} createdAt - The timestamp when the video was created. (Default: Date.now)
 * @property {Date} updatedAt - The timestamp when the video was last updated. (Default: Date.now)
 */
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', videoSchema);