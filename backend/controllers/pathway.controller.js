/**
 * @file pathway.controller.js
 * @description Defines the controller functions for pathway-related operations.
 * @module controllers/pathway
 * @requires ../models/Pathway
 * @requires ../utils/errorResponse
 */

const Pathway = require('../models/Pathway');
const Project = require('../models/Project');
const Folder = require('../models/Folder');
const Link = require('../models/Link');
const Video = require('../models/Video');
const Document = require('../models/Document');
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

    const { type, itemData } = req.body;
    let newContent;

    switch (type) {
      case 'Link':
        newContent = new Link(itemData);
        await newContent.save();
        break;
      case 'Video':
        newContent = new Video(itemData);
        await newContent.save();
        break;
      case 'Document':
        newContent = new Document(itemData);
        await newContent.save();
        break;
      default:
        return next(new ErrorResponse('Invalid item type', 400));
    }

    const newItem = {
      type,
      content: newContent._id, // Store the ID of the newly created content
    };

    pathway.items.unshift(newItem);

    await pathway.save();

    // Populate the newly added item to return full details
    const updatedPathway = await Pathway.findById(req.params.id).populate({
      path: 'items.content',
      model: type, // Dynamically populate based on the type
    });


    res.status(200).json({ success: true, data: updatedPathway });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateItemCompletionStatus
 * @description Update the completion status of a pathway item.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateItemCompletionStatus = async (req, res, next) => {
  try {
    const { pathwayId, itemId } = req.params;
    const { completed } = req.body;

    const pathway = await Pathway.findById(pathwayId)
      .populate('project', 'owner')
      .populate('folder', 'project');

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    // Authorization check
    let authorized = false;
    if (pathway.project && pathway.project.owner.toString() === req.user.id) {
      authorized = true;
    } else if (pathway.folder) {
      const parentFolder = await Folder.findById(pathway.folder).populate('project', 'owner');
      if (parentFolder && parentFolder.project.owner.toString() === req.user.id) {
        authorized = true;
      }
    }

    if (!authorized) {
      return next(new ErrorResponse('Not authorized to update this item', 401));
    }

    const item = pathway.items.id(itemId);

    if (!item) {
      return next(new ErrorResponse('Item not found in pathway', 404));
    }

    item.completed = completed;

    await pathway.save();

    res.status(200).json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
};