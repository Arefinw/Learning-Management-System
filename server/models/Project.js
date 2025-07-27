/**
 * @fileoverview This file defines the Mongoose schema for the Project model.
 * @description The Project model represents a folder or a container for pathways within a workspace.
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  /**
   * @property {string} name - The name of the project (folder).
   * @required
   */
  name: {
    type: String,
    required: true,
  },
  /**
   * @property {mongoose.Schema.Types.ObjectId} parent - The ID of the parent project, if it's a sub-project.
   * @default null
   * @indexed
   * @ref Project
   */
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null,
    index: true,
  },
  /**
   * @property {mongoose.Schema.Types.ObjectId} workspace - The ID of the workspace this project belongs to.
   * @required
   * @indexed
   * @ref Workspace
   */
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true,
  },
  /**
   * @property {object} permissions - Defines the access control for the project.
   * @property {boolean} permissions.public - If true, the project is accessible to anyone.
   * @default false
   * @property {boolean} permissions.workspace - If true, the project is accessible to all members of its workspace.
   * @default true
   * @property {Array<mongoose.Schema.Types.ObjectId>} permissions.private - An array of user IDs who have private access to this project.
   * @ref User
   */
  permissions: {
    public: {
      type: Boolean,
      default: false,
    },
    workspace: {
      type: Boolean,
      default: true,
    },
    private: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
