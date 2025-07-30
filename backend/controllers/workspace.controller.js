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
      .populate('projects');

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check authorization: owner can always access
    if (workspace.owner._id.toString() === req.user.id) {
      return res.status(200).json({ success: true, data: workspace });
    }

    // Check if user is a member for private/workspace visibility
    const isMember = workspace.members.some(member => member.user._id.toString() === req.user.id);

    if (workspace.visibility === 'private' && !isMember) {
      return next(new ErrorResponse('User not authorized to view this workspace', 401));
    }

    if (workspace.visibility === 'workspace' && !isMember) {
      return next(new ErrorResponse('User not authorized to view this workspace', 401));
    }

    // Public workspaces are accessible by anyone (if not caught by previous checks)
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

/**
 * @function removeMember
 * @description Remove a member from a workspace.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.removeMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    const memberIndex = workspace.members.findIndex(member => member.user.toString() === req.params.memberId);

    if (memberIndex === -1) {
      return next(new ErrorResponse('Member not found in this workspace', 404));
    }

    // Prevent owner from removing themselves
    if (workspace.members[memberIndex].user.toString() === req.user.id) {
      return next(new ErrorResponse('Cannot remove yourself from the workspace', 400));
    }

    const removedMemberId = workspace.members[memberIndex].user;
    workspace.members.splice(memberIndex, 1);

    await workspace.save();

    // Remove workspace from the user's workspaces array
    await User.findByIdAndUpdate(removedMemberId, { $pull: { workspaces: workspace._id } });

    res.status(200).json({ success: true, message: 'Member removed from workspace' });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateMemberRole
 * @description Update a member's role in a workspace.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateMemberRole = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    const { role } = req.body;

    const member = workspace.members.find(member => member.user.toString() === req.params.memberId);

    if (!member) {
      return next(new ErrorResponse('Member not found in this workspace', 404));
    }

    member.role = role;

    await workspace.save();

    res.status(200).json({ success: true, message: 'Member role updated', data: workspace });
  } catch (err) {
    next(err);
  }
};