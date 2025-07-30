/**
 * @file User.js
 * @description Defines the Mongoose schema for the User model.
 * @module models/User
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * @schema userSchema
 * @description Mongoose schema for users.
 * @property {String} name - The name of the user. (Required)
 * @property {String} email - The email of the user. (Required, Unique)
 * @property {String} password - The hashed password of the user. (Required)
 * @property {String} role - The role of the user. (Enum: 'user', 'admin', Default: 'user')
 * @property {Array<mongoose.Schema.Types.ObjectId>} workspaces - An array of ObjectIds referencing the workspaces the user is a part of.
 * @property {Date} createdAt - The timestamp when the user was created. (Default: Date.now)
 * @property {Date} updatedAt - The timestamp when the user was last updated. (Default: Date.now)
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);