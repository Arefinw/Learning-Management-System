/**
 * @file workspace.routes.js
 * @description Defines the API routes for workspace-related operations.
 * @module routes/workspace
 * @requires express
 * @requires ../controllers/workspace.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
} = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/workspaces
 * @desc    Get all workspaces for the logged in user
 * @access  Private
 * @returns { Array<Workspace> }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   POST /api/workspaces
 * @desc    Create a new workspace
 * @access  Private
 * @body    { "name": "My Workspace", "description": "A description for my workspace." }
 * @returns { Workspace }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */
router.route('/').get(protect, getWorkspaces).post(protect, createWorkspace);

/**
 * @route   GET /api/workspaces/:id
 * @desc    Get a single workspace by ID
 * @access  Private
 * @returns { Workspace }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not a member
 * @throws  { 404 } - Not Found - If workspace is not found
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   PUT /api/workspaces/:id
 * @desc    Update a workspace
 * @access  Private (Owner)
 * @body    { "name": "Updated Workspace Name", "description": "Updated description." }
 * @returns { Workspace }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If workspace is not found
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   DELETE /api/workspaces/:id
 * @desc    Delete a workspace
 * @access  Private (Owner)
 * @returns { { success: true, message: 'Workspace removed' } }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If workspace is not found
 * @throws  { 500 } - Internal Server Error
 */
router
  .route('/:id')
  .get(protect, getWorkspace)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);

/**
 * @route   POST /api/workspaces/:id/members
 * @desc    Add a member to a workspace
 * @access  Private (Owner)
 * @body    { "email": "member@example.com", "role": "member" }
 * @returns { Workspace }
 * @throws  { 400 } - Bad Request - If user is already a member
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If workspace or user not found
 * @throws  { 500 } - Internal Server Error
 */
router.route('/:id/members').post(protect, addMember);

module.exports = router;