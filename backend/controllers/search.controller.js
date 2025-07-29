const Project = require('../models/Project');
const Folder = require('../models/Folder');
const Pathway = require('../models/Pathway');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Search across projects, folders, and pathways
// @route   GET /api/search
// @access  Private
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(new ErrorResponse('Search query is required', 400));
    }

    const regex = new RegExp(q, 'i'); // Case-insensitive search

    const projects = await Project.find({
      owner: req.user.id,
      $or: [{ name: regex }, { description: regex }],
    });

    const folders = await Folder.find({
      project: { $in: projects.map((p) => p._id) },
      $or: [{ name: regex }, { description: regex }],
    });

    const pathways = await Pathway.find({
      $and: [
        {
          $or: [
            { project: { $in: projects.map((p) => p._id) } },
            { folder: { $in: folders.map((f) => f._id) } },
          ],
        },
        { $or: [{ title: regex }, { description: regex }] },
      ],
    });

    res.status(200).json({ success: true, data: { projects, folders, pathways } });
  } catch (err) {
    next(err);
  }
};
