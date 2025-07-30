/**
 * @file Link.js
 * @description Defines the Mongoose schema for the Link model.
 * @module models/Link
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @schema linkSchema
 * @description Mongoose schema for links.
 * @property {String} title - The title of the link. (Required)
 * @property {String} url - The URL of the link. (Required)
 * @property {String} description - A description of the link.
 * @property {Date} createdAt - The timestamp when the link was created. (Default: Date.now)
 * @property {Date} updatedAt - The timestamp when the link was last updated. (Default: Date.now)
 */
const linkSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Link', linkSchema);