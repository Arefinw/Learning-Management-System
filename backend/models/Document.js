/**
 * @file Document.js
 * @description Defines the Mongoose schema for the Document model.
 * @module models/Document
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @schema documentSchema
 * @description Mongoose schema for documents.
 * @property {String} title - The title of the document. (Required)
 * @property {String} content - The content of the document in markdown format.
 * @property {String} description - A description of the document.
 * @property {Date} createdAt - The timestamp when the document was created. (Default: Date.now)
 * @property {Date} updatedAt - The timestamp when the document was last updated. (Default: Date.now)
 */
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
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

module.exports = mongoose.model('Document', documentSchema);