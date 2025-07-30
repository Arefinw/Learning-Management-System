/**
 * @file folder.controller.js
 * @description Defines the controller functions for folder-related operations.
 * @module controllers/folder
 * @requires ../models/Folder
 * @requires ../models/Project
 * @requires ../utils/errorResponse
 */

const Folder = require('../models/Folder');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function createFolder
 * @description Create a new folder.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.createFolder = async (req, res, next) => {
  const { name, description, parentFolder, project } = req.body;

  try {
    const newFolder = new Folder({
      name,
      description,
      parentFolder,
      project,
    });

    const folder = await newFolder.save();

    // Add folder to parent folder's subFolders array or project's folders array
    if (parentFolder) {
      await Folder.findByIdAndUpdate(parentFolder, { $push: { subFolders: folder._id } });
    } else if (project) {
      await Project.findByIdAndUpdate(project, { $push: { folders: folder._id } });
    }

    res.status(201).json({ success: true, data: folder });
  } catch (err) {
    next(err);
  }
};

/**
 * @function getFolder
 * @description Get a single folder by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findById(req.params.id)
      .populate('subFolders')
      .populate('pathways');

    if (!folder) {
      return next(new ErrorResponse('Folder not found', 404));
    }

    res.status(200).json({ success: true, data: folder });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateFolder
 * @description Update a folder.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateFolder = async (req, res, next) => {
  const { name, description } = req.body;

  const folderFields = {};
  if (name) folderFields.name = name;
  if (description) folderFields.description = description;

  try {
    let folder = await Folder.findById(req.params.id);

    if (!folder) {
      return next(new ErrorResponse('Folder not found', 404));
    }

    folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { $set: folderFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: folder });
  } catch (err) {
    next(err);
  }
};

/**
 * @function deleteFolder
 * @description Delete a folder.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return next(new ErrorResponse('Folder not found', 404));
    }

    // Remove from parent folder's subFolders array
    if (folder.parentFolder) {
      await Folder.findByIdAndUpdate(folder.parentFolder, { $pull: { subFolders: folder._id } });
    }

    // Remove from project's folders array
    if (folder.project) {
      await Project.findByIdAndUpdate(folder.project, { $pull: { folders: folder._id } });
    }

    // Recursively delete subfolders and pathways within this folder
    await Promise.all([
      Folder.deleteMany({ parentFolder: folder._id }),
      // Assuming pathways directly linked to folder should also be deleted or re-parented
      // For now, let's delete them. Re-parenting would be more complex.
      Pathway.deleteMany({ folder: folder._id }),
    ]);

    await folder.deleteOne();

    res.status(200).json({ success: true, message: 'Folder removed' });
  } catch (err) {
    next(err);
  }
};
