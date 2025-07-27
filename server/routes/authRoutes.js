/**
 * @fileoverview This file contains the authentication routes for the application.
 * @description It defines the API endpoints for user registration and login.
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginUser);

module.exports = router;
