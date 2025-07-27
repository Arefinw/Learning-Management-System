/**
 * @fileoverview This file contains the project controllers for the application.
 * @description It handles CRUD operations for projects (folders).
 */

const Project = require('../models/Project');

/**
 * @description Get all projects for a given workspace.
 * @route GET /api/projects/workspace/:workspaceId
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the projects.
 */
const getProjectsByWorkspace = async (req, res) => {
  try {
    const projects = await Project.find({ workspace: req.params.workspaceId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Create a new project.
 * @route POST /api/projects
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the created project.
 */
const createProject = async (req, res) => {
  const { name, parent, workspace } = req.body;

  try {
    const project = await Project.create({
      name,
      parent,
      workspace,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @description Update project permissions.
 * @route PUT /api/projects/:id/permissions
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the updated project.
 */
const updateProjectPermissions = async (req, res) => {
  const { public, workspace, private } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.permissions.public = public;
      project.permissions.workspace = workspace;
      project.permissions.private = private;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get a single project by ID.
 * @route GET /api/projects/:id
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response with the project.
 */
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjectsByWorkspace, createProject, updateProjectPermissions, getProjectById };
