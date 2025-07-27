/**
 * @fileoverview This file contains the pathway controllers for the application.
 * @description It handles CRUD operations for pathways.
 */

const Pathway = require('../models/Pathway');

/**
 * @description Get all pathways for a given project.
 * @route GET /api/pathways/project/:projectId
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the pathways.
 */
const getPathwaysByProject = async (req, res) => {
  try {
    const pathways = await Pathway.find({ project: req.params.projectId });
    res.json(pathways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Create a new pathway.
 * @route POST /api/pathways
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the created pathway.
 */
const createPathway = async (req, res) => {
  const { title, project } = req.body;

  try {
    const pathway = await Pathway.create({
      title,
      project,
    });
    res.status(201).json(pathway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @description Get a single pathway by ID.
 * @route GET /api/pathways/:id
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the pathway.
 */
const getPathwayById = async (req, res) => {
  try {
    const pathway = await Pathway.findById(req.params.id);
    res.json(pathway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPathwaysByProject, createPathway, getPathwayById };
