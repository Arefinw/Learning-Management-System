/**
 * @file project.routes.js
 * @description Defines the API routes for project-related operations.
 * @module routes/project
 * @requires express
 * @requires ../controllers/project.controller
 * @requires ../middleware/auth.middleware
 */

const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getProjectTree,
  getProjectsByWorkspace,
  deleteFolderFromProject,
  deletePathwayFromProject,
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/projects
 * @desc    Get all projects for the logged in user
 * @access  Private
 * @returns { Array<Project> }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 * @body    { "name": "My Project", "description": "A description for my project.", "workspace": "<workspace_id>" }
 * @returns { Project }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */
router.route('/').get(protect, getProjects).post(protect, createProject);

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by ID
 * @access  Private
 * @returns { Project }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not a member of the workspace
 * @throws  { 404 } - Not Found - If project is not found
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private (Owner)
 * @body    { "name": "Updated Project Name", "description": "Updated description." }
 * @returns { Project }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If project is not found
 * @throws  { 500 } - Internal Server Error
 */

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private (Owner)
 * @returns { { success: true, message: 'Project removed' } }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If project is not found
 * @throws  { 500 } - Internal Server Error
 */
router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

/**
 * @route   GET /api/projects/:id/tree
 * @desc    Get the folder and pathway tree for a project
 * @access  Private
 * @returns { { folders: Array<Folder>, pathways: Array<Pathway> } }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not a member of the workspace
 * @throws  { 404 } - Not Found - If project is not found
 * @throws  { 500 } - Internal Server Error
 */
router.route('/:id/tree').get(protect, getProjectTree);

/**
 * @route   GET /api/projects/workspace/:workspaceId
 * @desc    Get all projects for a given workspace
 * @access  Private
 * @returns { Array<Project> }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not a member of the workspace
 * @throws  { 500 } - Internal Server Error
 */
router.route('/workspace/:workspaceId').get(protect, getProjectsByWorkspace);

/**
 * @route   DELETE /api/projects/:projectId/folders/:folderId
 * @desc    Delete a folder from a project
 * @access  Private (Owner)
 * @returns { { success: true, message: 'Folder removed from project' } }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If project or folder is not found
 * @throws  { 500 } - Internal Server Error
 */
router.route('/:projectId/folders/:folderId').delete(protect, deleteFolderFromProject);

/**
 * @route   DELETE /api/projects/:projectId/pathways/:pathwayId
 * @desc    Delete a pathway from a project
 * @access  Private (Owner)
 * @returns { { success: true, message: 'Pathway removed from project' } }
 * @throws  { 401 } - Unauthorized - If token is not valid or user is not the owner
 * @throws  { 404 } - Not Found - If project or pathway is not found
 * @throws  { 500 } - Internal Server Error
 */
router.route('/:projectId/pathways/:pathwayId').delete(protect, authorize('admin'), deletePathwayFromProject);

module.exports = router;