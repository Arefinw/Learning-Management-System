/**
 * @file Workspace.js
 * @description Defines the Mongoose schema for the Workspace model.
 * @module models/Workspace
 * @requires mongoose
 */

const mongoose = require("mongoose");

/**
 * @schema workspaceSchema
 * @description Mongoose schema for workspaces.
 * @property {String} name - The name of the workspace. (Required)
 * @property {String} description - A description of the workspace.
 * @property {mongoose.Schema.Types.ObjectId} owner - The user who owns the workspace. (Required, Ref: 'User')
 * @property {Array<Object>} members - An array of members in the workspace.
 * @property {mongoose.Schema.Types.ObjectId} members.user - The user who is a member. (Ref: 'User')
 * @property {String} members.role - The role of the member. (Enum: 'admin', 'editor', 'member', Default: 'member')
 * @property {Array<mongoose.Schema.Types.ObjectId>} projects - An array of ObjectIds referencing the projects within the workspace.
 * @property {String} visibility - The visibility of the workspace. (Enum: 'public', 'private', 'workspace', Default: 'private')
 * @property {Date} createdAt - The timestamp when the workspace was created. (Default: Date.now)
 * @property {Date} updatedAt - The timestamp when the workspace was last updated. (Default: Date.now)
 */
const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["admin", "editor", "member"],
        default: "member",
      },
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  visibility: {
    type: String,
    enum: ["public", "private", "workspace"],
    default: "private",
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

module.exports = mongoose.model("Workspace", workspaceSchema);