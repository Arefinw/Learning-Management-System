/**
 * @file document.controller.js
 * @description Defines the controller functions for document-related operations.
 * @module controllers/document
 * @requires ../models/Document
 * @requires ../utils/errorResponse
 */

const Document = require('../models/Document');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function createDocument
 * @description Create a new document.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.createDocument = async (req, res, next) => {
  const { title, content, description } = req.body;

  try {
    const newDocument = new Document({
      title,
      content,
      description,
    });

    const document = await newDocument.save();
    res.status(201).json({ success: true, data: document });
  } catch (err) {
    next(err);
  }
};

/**
 * @function getDocument
 * @description Get a single document by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    res.status(200).json({ success: true, data: document });
  } catch (err) {
    next(err);
  }
};

/**
 * @function updateDocument
 * @description Update a document.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.updateDocument = async (req, res, next) => {
  const { title, content, description } = req.body;

  const documentFields = {};
  if (title) documentFields.title = title;
  if (content) documentFields.content = content;
  if (description) documentFields.description = description;

  try {
    let document = await Document.findById(req.params.id);

    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    document = await Document.findByIdAndUpdate(
      req.params.id,
      { $set: documentFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: document });
  } catch (err) {
    next(err);
  }
};

/**
 * @function deleteDocument
 * @description Delete a document.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    await document.deleteOne();

    res.status(200).json({ success: true, message: 'Document removed' });
  } catch (err) {
    next(err);
  }
};
