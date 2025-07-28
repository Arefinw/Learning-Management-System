const Pathway = require('../models/Pathway');

// @desc    Get all pathways
// @route   GET /api/pathways
// @access  Private
exports.getPathways = async (req, res) => {
  try {
    const pathways = await Pathway.find({ project: req.query.project });
    res.json(pathways);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a pathway
// @route   POST /api/pathways
// @access  Private
exports.createPathway = async (req, res) => {
  const { title, description, project, folder } = req.body;

  try {
    const newPathway = new Pathway({
      title,
      description,
      project,
      folder,
    });

    const pathway = await newPathway.save();
    res.json(pathway);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single pathway
// @route   GET /api/pathways/:id
// @access  Private
exports.getPathway = async (req, res) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return res.status(404).json({ msg: 'Pathway not found' });
    }

    res.json(pathway);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update pathway
// @route   PUT /api/pathways/:id
// @access  Private
exports.updatePathway = async (req, res) => {
  const { title, description } = req.body;

  // Build pathway object
  const pathwayFields = {};
  if (title) pathwayFields.title = title;
  if (description) pathwayFields.description = description;

  try {
    let pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return res.status(404).json({ msg: 'Pathway not found' });
    }

    pathway = await Pathway.findByIdAndUpdate(
      req.params.id,
      { $set: pathwayFields },
      { new: true }
    );

    res.json(pathway);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete pathway
// @route   DELETE /api/pathways/:id
// @access  Private
exports.deletePathway = async (req, res) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return res.status(404).json({ msg: 'Pathway not found' });
    }

    await pathway.remove();

    res.json({ msg: 'Pathway removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add item to pathway
// @route   POST /api/pathways/:id/items
// @access  Private
exports.addItem = async (req, res) => {
  try {
    const pathway = await Pathway.findById(req.params.id);

    if (!pathway) {
      return res.status(404).json({ msg: 'Pathway not found' });
    }

    const { type, content } = req.body;

    const newItem = {
      type,
      content,
    };

    pathway.items.unshift(newItem);

    await pathway.save();

    res.json(pathway.items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
