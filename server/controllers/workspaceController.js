/**
 * @fileoverview This file contains the workspace controllers for the application.
 * @description It handles CRUD operations for workspaces.
 */

const Workspace = require('../models/Workspace');

/**
 * @description Get all workspaces for the logged-in user.
 * @route GET /api/workspaces
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the user's workspaces.
 */
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user.id });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkspaces };
