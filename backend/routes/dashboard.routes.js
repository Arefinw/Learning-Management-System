/**
 * @file dashboard.routes.js
 * @description This file defines the API routes for dashboard related operations.
 * @module routes/dashboard
 * @requires express
 * @requires ../controllers/dashboard.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 * @returns { object } - An object containing dashboard statistics.
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */
router.route('/stats').get(protect, getDashboardStats);

module.exports = router;