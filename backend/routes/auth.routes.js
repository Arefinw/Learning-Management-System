/**
 * @file auth.routes.js
 * @description Defines the API routes for user authentication.
 * @module routes/auth
 * @requires express
 * @requires express-validator
 * @requires ../controllers/auth.controller
 * @requires ../middleware/auth.middleware
 * @requires ../middleware/validation.middleware
 */

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { "name": "John Doe", "email": "john.doe@example.com", "password": "password123" }
 * @returns { "token": "<jwt_token>" }
 * @throws  { 400 } - Bad Request - If validation fails
 * @throws  { 500 } - Internal Server Error
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  validate,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 * @body    { "email": "john.doe@example.com", "password": "password123" }
 * @returns { "token": "<jwt_token>" }
 * @throws  { 400 } - Bad Request - If validation fails
 * @throws  { 401 } - Unauthorized - Invalid credentials
 * @throws  { 500 } - Internal Server Error
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  validate,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get the logged in user's details
 * @access  Private
 * @returns { "_id": "<user_id>", "name": "John Doe", "email": "john.doe@example.com", ... }
 * @throws  { 401 } - Unauthorized - If token is not valid
 * @throws  { 500 } - Internal Server Error
 */
router.get('/me', protect, getMe);

module.exports = router;
