/**
 * @file search.routes.js
 * @description Defines the API routes for search operations.
 * @module routes/search
 * @requires express
 * @requires ../controllers/search.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const { search } = require('../controllers/search.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/search
 * @desc    Search for workspaces, projects, folders, and pathways.
 * @access  Private
 * @query   { String } q - The search query.
 * @returns { object } - An object containing search results.
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */
router.route('/').get(protect, search);

module.exports = router;