/**
 * @file Pathway.js
 * @description Defines the Mongoose schema for the Pathway model.
 * @module models/Pathway
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @schema pathwaySchema
 * @description Mongoose schema for pathways.
 * @property {String} title - The title of the pathway. (Required)
 * @property {String} description - A description of the pathway.
 * @property {Array<Object>} items - An array of items within the pathway.
 * @property {String} items.type - The type of the item. (Enum: 'Link', 'Video', 'Document', Required)
 * @property {mongoose.Schema.Types.ObjectId} items.content - The ObjectId of the item's content.
 * @property {Boolean} items.completed - Whether the item is completed. (Default: false)
 * @property {mongoose.Schema.Types.ObjectId} parentPathway - The parent pathway, for composition. (Ref: 'Pathway')
 * @property {Array<mongoose.Schema.Types.ObjectId>} subPathways - An array of ObjectIds referencing sub-pathways.
 * @property {mongoose.Schema.Types.ObjectId} project - The project the pathway belongs to. (Ref: 'Project')
 * @property {mongoose.Schema.Types.ObjectId} folder - The folder the pathway belongs to. (Ref: 'Folder')
 * @property {String} visibility - The visibility of the pathway. (Enum: 'public', 'private', 'project', 'folder', Default: 'private')
 * @property {Date} createdAt - The timestamp when the pathway was created. (Default: Date.now)
 * @property {Boolean} completed - Whether the pathway is completed. (Default: false)
 * @property {Date} updatedAt - The timestamp when the pathway was last updated. (Default: Date.now)
 */
const pathwaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  items: [
    {
      type: {
        type: String,
        enum: ['Link', 'Video', 'Document'],
        required: true,
      },
      content: {
        type: mongoose.Schema.Types.ObjectId,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  parentPathway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pathway',
  },
  subPathways: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pathway',
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'project', 'folder'],
    default: 'private',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pathway', pathwaySchema);