/**
 * @file user.controller.js
 * @description Defines the controller functions for user-related operations.
 * @module controllers/user
 * @requires ../models/User
 * @requires ../utils/errorResponse
 */

const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function getUsers
 * @description Get all users.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

/**
 * @function getUser
 * @description Get a single user by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateUser
 * @description Update a user's details.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Make sure user owns the profile
    if (user.id.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this user', 401));
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};