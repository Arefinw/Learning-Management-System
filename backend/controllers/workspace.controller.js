const Workspace = require('../models/Workspace');
const User = require('../models/User'); // Import User model

// @desc    Get all workspaces
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ owner: req.user.id }).populate('owner', 'name email').populate('members.user', 'name email');
    res.json({ success: true, data: workspaces });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Create a workspace
// @route   POST /api/workspaces
// @access  Private
exports.createWorkspace = async (req, res) => {
  const { name, description, visibility } = req.body;

  try {
    const newWorkspace = new Workspace({
      name,
      description,
      owner: req.user.id,
      visibility,
    });

    const workspace = await newWorkspace.save();
    res.status(201).json({ success: true, data: workspace });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
exports.getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('projects'); // Populate projects to display in workspace detail

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Check for user authorization based on visibility
    if (workspace.visibility === 'private' && workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }
    if (workspace.visibility === 'workspace' && !workspace.members.some(member => member.user._id.toString() === req.user.id)) {
      return res.status(401).json({ success: false, error: 'User not authorized to view this workspace' });
    }


    res.json({ success: true, data: workspace });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
exports.updateWorkspace = async (req, res) => {
  const { name, description, visibility } = req.body;

  // Build workspace object
  const workspaceFields = {};
  if (name) workspaceFields.name = name;
  if (description) workspaceFields.description = description;
  if (visibility) workspaceFields.visibility = visibility;

  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Make sure user owns the workspace
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $set: workspaceFields },
      { new: true }
    );

    res.json({ success: true, data: workspace });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    await workspace.remove();

    res.json({ success: true, message: 'Workspace removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, error: 'Workspace not found' });
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    const { email, role = 'member' } = req.body; // Default role to 'member'

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check if user is already a member
    if (workspace.members.some(member => member.user.toString() === user._id.toString())) {
      return res.status(400).json({ success: false, error: 'User is already a member of this workspace' });
    }

    const newMember = {
      user: user._id,
      role,
    };

    workspace.members.unshift(newMember);

    await workspace.save();

    // Populate the user field for the newly added member in the response
    const updatedWorkspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('projects');

    res.json({ success: true, data: updatedWorkspace });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
