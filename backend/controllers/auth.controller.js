/**
 * @file auth.controller.js
 * @description Defines the controller functions for user authentication.
 * @module controllers/auth
 * @requires ../models/User
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @requires ../utils/errorResponse
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @function register
 * @description Register a new user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorResponse('User already exists', 400));
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) return next(new ErrorResponse('Token generation failed', 500));
        res.status(201).json({ success: true, token });
      }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @function login
 * @description Authenticate user and get token.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 400));
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) return next(new ErrorResponse('Token generation failed', 500));
        res.status(200).json({ success: true, token });
      }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @function getMe
 * @description Get the logged in user's details.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};