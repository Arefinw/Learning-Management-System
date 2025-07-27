/**
 * @fileoverview This file defines the Mongoose schema for the Pathway model.
 * @description The Pathway model represents a structured learning module containing a series of items.
 */

const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
  /**
   * @property {string} title - The title of the pathway.
   * @required
   */
  title: {
    type: String,
    required: true,
  },
  /**
   * @property {mongoose.Schema.Types.ObjectId} project - The ID of the project this pathway belongs to.
   * @required
   * @indexed
   * @ref Project
   */
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true,
  },
  /**
   * @property {Array<string>} items - An array of items within the pathway (e.g., links, video URLs, Markdown content).
   */
  items: [
    {
      type: String,
    },
  ],
  /**
   * @property {object} permissions - Defines the access control for the pathway.
   * @property {boolean} permissions.public - If true, the pathway is accessible to anyone.
   * @default false
   * @property {boolean} permissions.workspace - If true, the pathway is accessible to all members of its workspace.
   * @default true
   * @property {Array<mongoose.Schema.Types.ObjectId>} permissions.private - An array of user IDs who have private access to this pathway.
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

module.exports = mongoose.model('Pathway', pathwaySchema);
