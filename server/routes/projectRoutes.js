/**
 * @fileoverview This file contains the project routes for the application.
 * @description It defines the API endpoints for project-related operations.
 */

const express = require('express');
const router = express.Router();
const {
  getProjectsByWorkspace,
  createProject,
  updateProjectPermissions,
  getProjectById,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/projects/workspace/:workspaceId
 * @desc    Get all projects for a given workspace
 * @access  Private
 */
router.get('/workspace/:workspaceId', protect, getProjectsByWorkspace);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', protect, createProject);

/**
 * @route   PUT /api/projects/:id/permissions
 * @desc    Update project permissions
 * @access  Private
 */
const { checkPermissions } = require('../middleware/permissionMiddleware');

/**
 * @route   GET /api/projects/:id
 * @desc    Get a project by ID
 * @access  Private
 */
router.get('/:id', protect, checkPermissions, getProjectById);

/**
 * @route   PUT /api/projects/:id/permissions
 * @desc    Update project permissions
 * @access  Private
 */
router.put('/:id/permissions', protect, updateProjectPermissions);

module.exports = router;
