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
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getProjects).post(protect, createProject);
router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/tree').get(protect, getProjectTree);
router.route('/workspace/:workspaceId').get(protect, getProjectsByWorkspace); // New route for projects by workspace
router.route('/:projectId/folders/:folderId').delete(protect, deleteFolderFromProject); // New route for deleting folder from project
router.route('/:projectId/pathways/:pathwayId').delete(protect, deletePathwayFromProject); // New route for deleting pathway from project

module.exports = router;
