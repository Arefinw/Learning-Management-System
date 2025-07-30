/**
 * @file link.controller.js
 * @description Defines the controller functions for link-related operations.
 * @module controllers/link
 * @requires ../models/Link
 * @requires ../utils/errorResponse
 */

const Link = require('../models/Link');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function createLink
 * @description Create a new link.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.createLink = async (req, res, next) => {
  const { title, url, description } = req.body;

  try {
    const newLink = new Link({
      title,
      url,
      description,
    });

    const link = await newLink.save();
    res.status(201).json({ success: true, data: link });
  } catch (err) {
    next(err);
  }
};

/**
 * @function getLink
 * @description Get a single link by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getLink = async (req, res, next) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return next(new ErrorResponse('Link not found', 404));
    }

    res.status(200).json({ success: true, data: link });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateLink
 * @description Update a link.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateLink = async (req, res, next) => {
  const { title, url, description } = req.body;

  const linkFields = {};
  if (title) linkFields.title = title;
  if (url) linkFields.url = url;
  if (description) linkFields.description = description;

  try {
    let link = await Link.findById(req.params.id);

    if (!link) {
      return next(new ErrorResponse('Link not found', 404));
    }

    link = await Link.findByIdAndUpdate(
      req.params.id,
      { $set: linkFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: link });
  } catch (err) {
    next(err);
  }
};

/**
 * @function deleteLink
 * @description Delete a link.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return next(new ErrorResponse('Link not found', 404));
    }

    await link.deleteOne();

    res.status(200).json({ success: true, message: 'Link removed' });
  } catch (err) {
    next(err);
  }
};
