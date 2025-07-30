/**
 * @file video.routes.js
 * @description Defines the API routes for video-related operations.
 * @module routes/video
 * @requires express
 * @requires ../controllers/video.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const {
  createVideo,
  getVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/video.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/').post(protect, createVideo);
router.route('/:id').get(protect, getVideo).put(protect, authorize('admin'), updateVideo).delete(protect, authorize('admin'), deleteVideo);

module.exports = router;
