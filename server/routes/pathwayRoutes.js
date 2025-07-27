/**
 * @fileoverview This file contains the pathway routes for the application.
 * @description It defines the API endpoints for pathway-related operations.
 */

const express = require('express');
const router = express.Router();
const {
  getPathwaysByProject,
  createPathway,
  getPathwayById,
} = require('../controllers/pathwayController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/pathways/project/:projectId
 * @desc    Get all pathways for a given project
 * @access  Private
 */
router.get('/project/:projectId', protect, getPathwaysByProject);

/**
 * @route   POST /api/pathways
 * @desc    Create a new pathway
 * @access  Private
 */
const { checkPermissions } = require('../middleware/permissionMiddleware');

/**
 * @route   GET /api/pathways/:id
 * @desc    Get a pathway by ID
 * @access  Private
 */
router.get('/:id', protect, checkPermissions, getPathwayById);

/**
 * @route   POST /api/pathways
 * @desc    Create a new pathway
 * @access  Private
 */
router.post('/', protect, createPathway);

module.exports = router;
