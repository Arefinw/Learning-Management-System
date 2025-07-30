/**
 * @file user.routes.js
 * @description Defines the API routes for user-related operations.
 * @module routes/user
 * @requires express
 * @requires ../controllers/user.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin)
 * @returns { Array<User> }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 403 } - Forbidden - If user is not an admin
 * @throws  { 500 } - Internal Server Error
 */
router.route('/').get(protect, authorize('admin'), getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Private
 * @returns { User }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 404 } - Not Found - If user is not found
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user's details
 * @access  Private
 * @body    { "name": "John Doe", "email": "john.doe@example.com" }
 * @returns { User }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 404 } - Not Found - If user is not found
 * @throws  { 500 } - Internal Server Error
 */
router.route('/:id').get(protect, getUser).put(protect, updateUser).delete(protect, authorize('admin'), deleteUser);

module.exports = router;