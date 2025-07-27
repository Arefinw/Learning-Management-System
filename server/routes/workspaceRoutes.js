/**
 * @fileoverview This file contains the workspace routes for the application.
 * @description It defines the API endpoints for workspace-related operations.
 */

const express = require('express');
const router = express.Router();
const { getWorkspaces } = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/workspaces
 * @desc    Get all workspaces for the logged-in user
 * @access  Private
 */
router.get('/', protect, getWorkspaces);

module.exports = router;
