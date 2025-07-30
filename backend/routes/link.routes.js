/**
 * @file link.routes.js
 * @description Defines the API routes for link-related operations.
 * @module routes/link
 * @requires express
 * @requires ../controllers/link.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const {
  createLink,
  getLink,
  updateLink,
  deleteLink,
} = require('../controllers/link.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/').post(protect, createLink);
router.route('/:id').get(protect, getLink).put(protect, authorize('admin'), updateLink).delete(protect, authorize('admin'), deleteLink);

module.exports = router;
