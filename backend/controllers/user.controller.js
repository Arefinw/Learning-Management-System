const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Make sure user owns the profile
    if (user.id.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this user', 401));
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
