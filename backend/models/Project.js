/**
 * @file Project.js
 * @description Defines the Mongoose schema for the Project model.
 * @module models/Project
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @schema projectSchema
 * @description Mongoose schema for projects.
 * @property {String} name - The name of the project. (Required)
 * @property {String} description - A description of the project.
 * @property {mongoose.Schema.Types.ObjectId} parentProject - The parent project, for hierarchical structure. (Ref: 'Project')
 * @property {Array<mongoose.Schema.Types.ObjectId>} subProjects - An array of ObjectIds referencing sub-projects.
 * @property {mongoose.Schema.Types.ObjectId} owner - The user who owns the project. (Required, Ref: 'User')
 * @property {mongoose.Schema.Types.ObjectId} workspace - The workspace the project belongs to. (Ref: 'Workspace')
 * @property {Array<mongoose.Schema.Types.ObjectId>} folders - An array of ObjectIds referencing folders within the project.
 * @property {Array<mongoose.Schema.Types.ObjectId>} pathways - An array of ObjectIds referencing pathways within the project.
 * @property {String} visibility - The visibility of the project. (Enum: 'public', 'private', 'workspace', Default: 'private')
 * @property {Date} createdAt - The timestamp when the project was created. (Default: Date.now)
 * @property {Date} updatedAt - The timestamp when the project was last updated. (Default: Date.now)
 */
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parentProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  subProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  },
  folders: [
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
  visibility: {
    type: String,
    enum: ['public', 'private', 'workspace'],
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

module.exports = mongoose.model('Project', projectSchema);