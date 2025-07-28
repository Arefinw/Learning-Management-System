/**
 * @file dashboard.routes.js
 * @description This file defines the API routes for dashboard related operations.
 */

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/stats').get(protect, getDashboardStats);

module.exports = router;
