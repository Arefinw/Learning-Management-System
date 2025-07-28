const express = require('express');
const router = express.Router();
const {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
} = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getWorkspaces).post(protect, createWorkspace);
router
  .route('/:id')
  .get(protect, getWorkspace)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);

router.route('/:id/members').post(protect, addMember);

module.exports = router;
