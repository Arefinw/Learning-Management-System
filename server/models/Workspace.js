/**
 * @fileoverview This file defines the Mongoose schema for the Workspace model.
 * @description The Workspace model represents a collaborative space where users can organize projects and pathways.
 */

const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  /**
   * @property {string} name - The name of the workspace.
   * @required
   */
  name: {
    type: String,
    required: true,
  },
  /**
   * @property {mongoose.Schema.Types.ObjectId} owner - The ID of the user who owns this workspace.
   * @required
   * @ref User
   */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  /**
   * @property {Array<mongoose.Schema.Types.ObjectId>} members - An array of user IDs who are members of this workspace.
   * @ref User
   */
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Workspace', workspaceSchema);
