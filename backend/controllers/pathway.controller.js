/**
 * @file pathway.controller.js
 * @description Defines the controller functions for pathway-related operations.
 * @module controllers/pathway
 * @requires ../models/Pathway
 * @requires ../utils/errorResponse
 */

const Pathway = require('../models/Pathway');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function getPathways
 * @description Get all pathways for a given project.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getPathways = async (req, res, next) => {
  try {
    const pathways = await Pathway.find({ project: req.query.project });
    res.status(200).json({ success: true, data: pathways });
  } catch (err) {
    next(err);
  }
};

/**
 * @function createPathway
 * @description Create a new pathway.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.createPathway = async (req, res, next) => {
  const { title, description, project, folder } = req.body;

  try {
    const newPathway = new Pathway({
      title,
      description,
      project,
      folder,
    });

    const pathway = await newPathway.save();
    res.status(201).json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
};

/**
 * @function getPathway
 * @description Get a single pathway by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getPathway = async (req, res, next) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    res.status(200).json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updatePathway
 * @description Update a pathway.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updatePathway = async (req, res, next) => {
  const { title, description } = req.body;

  // Build pathway object
  const pathwayFields = {};
  if (title) pathwayFields.title = title;
  if (description) pathwayFields.description = description;

  try {
    let pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    pathway = await Pathway.findByIdAndUpdate(
      req.params.id,
      { $set: pathwayFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
};

/**
 * @function deletePathway
 * @description Delete a pathway.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.deletePathway = async (req, res, next) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    await pathway.deleteOne();

    res.status(200).json({ success: true, message: 'Pathway removed' });
  } catch (err) {
    next(err);
  }
};

/**
 * @function addItem
 * @description Add an item to a pathway.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.addItem = async (req, res, next) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    const { type, content } = req.body;

    const newItem = {
      type,
      content,
    };

    pathway.items.unshift(newItem);

    await pathway.save();

    res.status(200).json({ success: true, data: pathway.items });
  } catch (err) {
    next(err);
  }
};