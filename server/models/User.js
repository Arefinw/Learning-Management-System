/**
 * @fileoverview This file defines the Mongoose schema for the User model.
 * @description The User model represents a user in the application, including their authentication details and associated workspaces.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  /**
   * @property {string} name - The name of the user.
   * @required
   */
  name: {
    type: String,
    required: true,
  },
  /**
   * @property {string} email - The email address of the user. Must be unique.
   * @required
   * @unique
   * @indexed
   */
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  /**
   * @property {string} password - The hashed password of the user.
   * @required
   */
  password: {
    type: String,
    required: true,
  },
  /**
   * @property {mongoose.Schema.Types.ObjectId} defaultWorkspace - The ID of the user's default workspace.
   * @ref Workspace
   */
  defaultWorkspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  },
  /**
   * @property {Array<mongoose.Schema.Types.ObjectId>} workspaces - An array of workspace IDs the user is a member of.
   * @ref Workspace
   */
  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
