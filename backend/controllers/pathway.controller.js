const Pathway = require('../models/Pathway');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all pathways
// @route   GET /api/pathways
// @access  Private
exports.getPathways = async (req, res, next) => {
  try {
    const pathways = await Pathway.find({ project: req.query.project });
    res.status(200).json({ success: true, data: pathways });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a pathway
// @route   POST /api/pathways
// @access  Private
exports.createPathway = async (req, res, next) => {
  const { title, description, project, folder } = req.body;

  try {
    const newPathway = new Pathway({
      title,
      description,
      project,
      folder,
    });

    const pathway = await newPathway.save();
    res.status(201).json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single pathway
// @route   GET /api/pathways/:id
// @access  Private
exports.getPathway = async (req, res, next) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    res.status(200).json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
};

// @desc    Update pathway
// @route   PUT /api/pathways/:id
// @access  Private
exports.updatePathway = async (req, res, next) => {
  const { title, description } = req.body;

  // Build pathway object
  const pathwayFields = {};
  if (title) pathwayFields.title = title;
  if (description) pathwayFields.description = description;

  try {
    let pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    pathway = await Pathway.findByIdAndUpdate(
      req.params.id,
      { $set: pathwayFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete pathway
// @route   DELETE /api/pathways/:id
// @access  Private
exports.deletePathway = async (req, res, next) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    await pathway.deleteOne();

    res.status(200).json({ success: true, message: 'Pathway removed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to pathway
// @route   POST /api/pathways/:id/items
// @access  Private
exports.addItem = async (req, res, next) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return next(new ErrorResponse('Pathway not found', 404));
    }

    const { type, content } = req.body;

    const newItem = {
      type,
      content,
    };

    pathway.items.unshift(newItem);

    await pathway.save();

    res.status(200).json({ success: true, data: pathway.items });
  } catch (err) {
    next(err);
  }
};
