const express = require('express');
const router = express.Router();
const {
  getPathways,
  createPathway,
  getPathway,
  updatePathway,
  deletePathway,
  addItem,
} = require('../controllers/pathway.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getPathways).post(protect, createPathway);
router
  .route('/:id')
  .get(protect, getPathway)
  .put(protect, updatePathway)
  .delete(protect, deletePathway);

router.route('/:id/items').post(protect, addItem);

module.exports = router;
