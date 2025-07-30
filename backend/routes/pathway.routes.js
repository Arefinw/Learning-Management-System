/**
 * @file pathway.routes.js
 * @description Defines the API routes for pathway-related operations.
 * @module routes/pathway
 * @requires express
 * @requires ../controllers/pathway.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const {
  getPathways,
  createPathway,
  getPathway,
  updatePathway,
  deletePathway,
  addItem,
} = require('../controllers/pathway.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/pathways
 * @desc    Get all pathways for the logged in user
 * @access  Private
 * @returns { Array<Pathway> }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   POST /api/pathways
 * @desc    Create a new pathway
 * @access  Private
 * @body    { "title": "My Pathway", "description": "A description for my pathway.", "project": "<project_id>" }
 * @returns { Pathway }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */
router.route('/').get(protect, getPathways).post(protect, createPathway);

/**
 * @route   GET /api/pathways/:id
 * @desc    Get a single pathway by ID
 * @access  Private
 * @returns { Pathway }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not a member of the project
 * @throws  { 404 } - Not Found - If pathway is not found
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   PUT /api/pathways/:id
 * @desc    Update a pathway
 * @access  Private (Owner)
 * @body    { "title": "Updated Pathway Title", "description": "Updated description." }
 * @returns { Pathway }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If pathway is not found
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   DELETE /api/pathways/:id
 * @desc    Delete a pathway
 * @access  Private (Owner)
 * @returns { { success: true, message: 'Pathway removed' } }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If pathway is not found
 * @throws  { 500 } - Internal Server Error
 */
router
  .route('/:id')
  .get(protect, getPathway)
  .put(protect, updatePathway)
  .delete(protect, deletePathway);

/**
 * @route   POST /api/pathways/:id/items
 * @desc    Add an item to a pathway
 * @access  Private (Owner)
 * @body    { "type": "Link", "content": "<link_id>" }
 * @returns { Pathway }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If pathway is not found
 * @throws  { 500 } - Internal Server Error
 */
router.route('/:id/items').post(protect, addItem);

module.exports = router;