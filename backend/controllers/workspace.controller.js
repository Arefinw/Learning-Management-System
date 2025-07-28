const Workspace = require('../models/Workspace');

// @desc    Get all workspaces
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ owner: req.user.id });
    res.json(workspaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a workspace
// @route   POST /api/workspaces
// @access  Private
exports.createWorkspace = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newWorkspace = new Workspace({
      name,
      description,
      owner: req.user.id,
    });

    const workspace = await newWorkspace.save();
    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
exports.getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
exports.updateWorkspace = async (req, res) => {
  const { name, description } = req.body;

  // Build workspace object
  const workspaceFields = {};
  if (name) workspaceFields.name = name;
  if (description) workspaceFields.description = description;

  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }

    // Make sure user owns the workspace
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $set: workspaceFields },
      { new: true }
    );

    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await workspace.remove();

    res.json({ msg: 'Workspace removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { email, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newMember = {
      user: user.id,
      role,
    };

    workspace.members.unshift(newMember);

    await workspace.save();

    res.json(workspace.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
