const Workspace = require('../models/Workspace');
const User = require('../models/User'); // Import User model
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all workspaces
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ owner: req.user.id }).populate('owner', 'name email').populate('members.user', 'name email');
    res.status(200).json({ success: true, data: workspaces });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a workspace
// @route   POST /api/workspaces
// @access  Private
exports.createWorkspace = async (req, res, next) => {
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
    next(err);
  }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
exports.getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .populate('projects'); // Populate projects to display in workspace detail

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    console.log("workspace", workspace)

    console.log("workspace's owner", workspace.owner._id.toString())
    console.log("user's id", req.user.id)
    // Check authorization based on visibility settings
    if (workspace.owner._id.toString() === req.user.id) {
      // OWNER: Always authorized - no further checks needed
    } else {
      // NOT OWNER: Check visibility-based access
      if (workspace.visibility === 'public') {
        // PUBLIC: Anyone can access - no further checks needed for authenticated users
      } else if (workspace.visibility === 'private') {
        // PRIVATE: Only explicit members can access
        const isExplicitMember = workspace.members.some(member => member.user.toString() === req.user.id);
        if (!isExplicitMember) {
          return next(new ErrorResponse('User not authorized to view this workspace', 401));
        }
      } else if (workspace.visibility === 'workspace') {
        // WORKSPACE: All workspace members can access
        const isWorkspaceMember = workspace.members.some(member => member.user.toString() === req.user.id);
        if (!isWorkspaceMember) {
          return next(new ErrorResponse('User not authorized to view this workspace', 401));
        }
      }
    }


    res.status(200).json({ success: true, data: workspace });
  } catch (err) {
    next(err);
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
exports.updateWorkspace = async (req, res, next) => {
  const { name, description, visibility } = req.body;

  // Build workspace object
  const workspaceFields = {};
  if (name) workspaceFields.name = name;
  if (description) workspaceFields.description = description;
  if (visibility) workspaceFields.visibility = visibility;

  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Make sure user owns the workspace
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized', 401));
    }

    workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $set: workspaceFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: workspace });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
exports.deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    await workspace.deleteOne();

    res.status(200).json({ success: true, message: 'Workspace removed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private
exports.addMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return next(new ErrorResponse('Workspace not found', 404));
    }

    // Check for user
    if (workspace.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    const { email, role = 'member' } = req.body; // Default role to 'member'

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user is already a member
    if (workspace.members.some(member => member.user.toString() === user._id.toString())) {
      return next(new ErrorResponse('User is already a member of this workspace', 400));
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

    res.status(200).json({ success: true, data: updatedWorkspace });
  } catch (err) {
    next(err);
  }
};
