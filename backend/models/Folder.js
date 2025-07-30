/**
 * @file Folder.js
 * @description Defines the Mongoose schema for the Folder model.
 * @module models/Folder
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @schema folderSchema
 * @description Mongoose schema for folders.
 * @property {String} name - The name of the folder. (Required)
 * @property {String} description - A description of the folder.
 * @property {mongoose.Schema.Types.ObjectId} parentFolder - The parent folder, for hierarchical structure. (Ref: 'Folder')
 * @property {Array<mongoose.Schema.Types.ObjectId>} subFolders - An array of ObjectIds referencing sub-folders.
 * @property {Array<mongoose.Schema.Types.ObjectId>} pathways - An array of ObjectIds referencing pathways within the folder.
 * @property {mongoose.Schema.Types.ObjectId} project - The project the folder belongs to. (Required, Ref: 'Project')
 * @property {String} visibility - The visibility of the folder. (Enum: 'public', 'private', 'project', Default: 'private')
 * @property {Date} createdAt - The timestamp when the folder was created. (Default: Date.now)
 * @property {Date} updatedAt - The timestamp when the folder was last updated. (Default: Date.now)
 */
const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
  },
  subFolders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
    },
  ],
  pathways: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pathway',
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'project'],
    default: 'private',
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

module.exports = mongoose.model('Folder', folderSchema);