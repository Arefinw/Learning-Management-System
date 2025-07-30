/**
 * @file document.routes.js
 * @description Defines the API routes for document-related operations.
 * @module routes/document
 * @requires express
 * @requires ../controllers/document.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/document.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/').post(protect, createDocument);
router.route('/:id').get(protect, getDocument).put(protect, authorize('admin'), updateDocument).delete(protect, authorize('admin'), deleteDocument);

module.exports = router;
