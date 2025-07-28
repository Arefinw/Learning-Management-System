const Project = require('../models/Project');
const Folder = require('../models/Folder');
const Pathway = require('../models/Pathway');

// @desc    Search across projects, folders, and pathways
// @route   GET /api/search
// @access  Private
exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
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
      $or: [
        { project: { $in: projects.map((p) => p._id) } },
        { folder: { $in: folders.map((f) => f._id) } },
      ],
      $or: [{ title: regex }, { description: regex }],
    });

    res.json({ projects, folders, pathways });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
