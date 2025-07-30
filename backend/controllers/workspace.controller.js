/**
 * @file workspace.controller.js
 * @description Defines the controller functions for workspace-related operations.
 * @module controllers/workspace
 * @requires ../models/Workspace
 * @requires ../models/User
 * @requires ../utils/errorResponse
 */

const Workspace = require('../models/Workspace');
const User = require('../models/User'); // Import User model
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function getWorkspaces
 * @description Get all workspaces for the logged in user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user.id }, { 'members.user': req.user.id }],
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
    res.status(200).json({ success: true, data: workspaces });
  } catch (err) {
    next(err);
  }
};

/**
 * @function createWorkspace
 * @description Create a new workspace.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.createWorkspace = async (req, res, next) => {
  const { name, description, visibility } = req.body;

  try {
    const newWorkspace = new Workspace({
      name,
      description,
      owner: req.user.id,
      visibility,
    });

    const workspace = await newWorkspace.save();

    // Add workspace to user's workspaces array
    const user = await User.findById(req.user.id);
    user.workspaces.push(workspace._id);
    await user.save();

    res.status(201).json({ success: true, data: workspace });
  } catch (err) {
    next(err);
  }
};

/**
 * @function getWorkspace
 * @description Get a single workspace by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('projects'); // Populate projects to display in workspace detail

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check authorization based on visibility settings
    if (workspace.owner._id.toString() !== req.user.id) {
      if (workspace.visibility === 'private') {
        const isExplicitMember = workspace.members.some(member => member.user._id.toString() === req.user.id);
        if (!isExplicitMember) {
          return next(new ErrorResponse('User not authorized to view this workspace', 401));
        }
      } else if (workspace.visibility === 'workspace') {
        const isWorkspaceMember = workspace.members.some(member => member.user.toString() === req.user.id);
        if (!isWorkspaceMember) {
          return next(new ErrorResponse('User not authorized to view this workspace', 401));
        }
      }
    }


    res.status(200).json({ success: true, data: workspace });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateWorkspace
 * @description Update a workspace.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateWorkspace = async (req, res, next) => {
  const { name, description, visibility } = req.body;

  // Build workspace object
  const workspaceFields = {};
  if (name) workspaceFields.name = name;
  if (description) workspaceFields.description = description;
  if (visibility) workspaceFields.visibility = visibility;

  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Make sure user owns the workspace
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized', 401));
    }

    workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $set: workspaceFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: workspace });
  } catch (err) {
    next(err);
  }
};

/**
 * @function deleteWorkspace
 * @description Delete a workspace.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    await workspace.deleteOne();

    res.status(200).json({ success: true, message: 'Workspace removed' });
  } catch (err) {
    next(err);
  }
};

/**
 * @function addMember
 * @description Add a member to a workspace.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.addMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    const { email, role = 'member' } = req.body; // Default role to 'member'

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user is already a member
    if (workspace.members.some(member => member.user.toString() === user._id.toString())) {
      return next(new ErrorResponse('User is already a member of this workspace', 400));
    }

    const newMember = {
      user: user._id,
      role,
    };

    workspace.members.unshift(newMember);

    await workspace.save();

    // Add workspace to user's workspaces array
    user.workspaces.push(workspace._id);
    await user.save();

    // Populate the user field for the newly added member in the response
    const updatedWorkspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('projects');

    res.status(200).json({ success: true, data: updatedWorkspace });
  } catch (err) {
    next(err);
  }
};