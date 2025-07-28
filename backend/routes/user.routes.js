const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUser).put(protect, updateUser);

module.exports = router;
