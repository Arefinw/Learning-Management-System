/**
 * @file folder.routes.js
 * @description Defines the API routes for folder-related operations.
 * @module routes/folder
 * @requires express
 * @requires ../controllers/folder.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const {
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
} = require('../controllers/folder.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/').post(protect, createFolder);
router.route('/:id').get(protect, getFolder).put(protect, authorize('admin'), updateFolder).delete(protect, authorize('admin'), deleteFolder);

module.exports = router;
