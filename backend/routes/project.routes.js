const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getProjectTree,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getProjects).post(protect, createProject);
router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/tree').get(protect, getProjectTree);

module.exports = router;
