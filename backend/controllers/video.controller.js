/**
 * @file video.controller.js
 * @description Defines the controller functions for video-related operations.
 * @module controllers/video
 * @requires ../models/Video
 * @requires ../utils/errorResponse
 */

const Video = require('../models/Video');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function createVideo
 * @description Create a new video.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.createVideo = async (req, res, next) => {
  const { title, url, description, duration, thumbnail } = req.body;

  try {
    const newVideo = new Video({
      title,
      url,
      description,
      duration,
      thumbnail,
    });

    const video = await newVideo.save();
    res.status(201).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
};

/**
 * @function getVideo
 * @description Get a single video by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return next(new ErrorResponse('Video not found', 404));
    }

    res.status(200).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateVideo
 * @description Update a video.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateVideo = async (req, res, next) => {
  const { title, url, description, duration, thumbnail } = req.body;

  const videoFields = {};
  if (title) videoFields.title = title;
  if (url) videoFields.url = url;
  if (description) videoFields.description = description;
  if (duration) videoFields.duration = duration;
  if (thumbnail) videoFields.thumbnail = thumbnail;

  try {
    let video = await Video.findById(req.params.id);

    if (!video) {
      return next(new ErrorResponse('Video not found', 404));
    }

    video = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: videoFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
};

/**
 * @function deleteVideo
 * @description Delete a video.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return next(new ErrorResponse('Video not found', 404));
    }

    await video.deleteOne();

    res.status(200).json({ success: true, message: 'Video removed' });
  } catch (err) {
    next(err);
  }
};
