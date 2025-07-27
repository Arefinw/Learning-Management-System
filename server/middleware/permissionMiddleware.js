/**
 * @fileoverview This file contains the permission middleware for the application.
 * @description It provides a function to check if a user has access to a resource.
 */

const Project = require('../models/Project');
const Pathway = require('../models/Pathway');
const Workspace = require('../models/Workspace');

/**
 * @description Checks if the user has permission to access a resource.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void}
 */
const checkPermissions = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  try {
    let resource;
    if (req.baseUrl.includes('/projects')) {
      resource = await Project.findById(id);
    } else if (req.baseUrl.includes('/pathways')) {
      resource = await Pathway.findById(id).populate('project');
    }

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.permissions.public) {
      return next();
    }

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if user is a member of the workspace if workspace permission is true
    if (resource.permissions.workspace) {
      const workspace = await Workspace.findById(resource.workspace);
      if (workspace && workspace.members.includes(user.id)) {
        return next();
      }
    }

    // Check if user is in the private access list
    if (resource.permissions.private.includes(user.id)) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkPermissions };
