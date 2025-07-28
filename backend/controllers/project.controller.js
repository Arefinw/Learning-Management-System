const Project = require('../models/Project');
const Workspace = require('../models/Workspace'); // Import Workspace model
const Folder = require('../models/Folder'); // Import Folder model
const Pathway = require('../models/Pathway'); // Import Pathway model

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .populate('owner', 'name email')
      .populate('workspace', 'name');
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get projects by workspace
// @route   GET /api/workspaces/:workspaceId/projects
// @access  Private
exports.getProjectsByWorkspace = async (req, res) => {
  try {
    const projects = await Project.find({ workspace: req.params.workspaceId, owner: req.user.id })
      .populate('owner', 'name email')
      .populate('workspace', 'name');
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  const { name, description, workspace, visibility } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      owner: req.user.id,
      workspace,
      visibility,
    });

    const project = await newProject.save();

    // Add project to workspace's projects array
    if (workspace) {
      await Workspace.findByIdAndUpdate(workspace, { $push: { projects: project._id } });
    }

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('workspace', 'name')
      .populate('folders')
      .populate('pathways');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check for user authorization based on visibility
    if (project.visibility === 'private' && project.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }
    // For 'workspace' visibility, check if user is a member of the associated workspace
    if (project.visibility === 'workspace' && project.workspace) {
      const workspace = await Workspace.findById(project.workspace);
      if (!workspace || !workspace.members.some(member => member.user.toString() === req.user.id)) {
        return res.status(401).json({ success: false, error: 'User not authorized to view this project' });
      }
    }


    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  const { name, description, visibility } = req.body;

  // Build project object
  const projectFields = {};
  if (name) projectFields.name = name;
  if (description) projectFields.description = description;
  if (visibility) projectFields.visibility = visibility;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Make sure user owns the project
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    );

    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    // Remove project from associated workspace
    if (project.workspace) {
      await Workspace.findByIdAndUpdate(project.workspace, { $pull: { projects: project._id } });
    }

    // Delete associated folders and pathways
    await Folder.deleteMany({ project: project._id });
    await Pathway.deleteMany({ project: project._id });

    await project.remove();

    res.json({ success: true, message: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get project tree
// @route   GET /api/projects/:id/tree
// @access  Private
exports.getProjectTree = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('folders')
      .populate('pathways');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Delete folder from project
// @route   DELETE /api/projects/:projectId/folders/:folderId
// @access  Private
exports.deleteFolderFromProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    // Remove folder from project's folders array
    project.folders = project.folders.filter(
      (folder) => folder.toString() !== req.params.folderId
    );
    await project.save();

    // Delete the folder itself
    await Folder.findByIdAndDelete(req.params.folderId);

    res.json({ success: true, message: 'Folder removed from project' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Delete pathway from project
// @route   DELETE /api/projects/:projectId/pathways/:pathwayId
// @access  Private
exports.deletePathwayFromProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    // Remove pathway from project's pathways array
    project.pathways = project.pathways.filter(
      (pathway) => pathway.toString() !== req.params.pathwayId
    );
    await project.save();

    // Delete the pathway itself
    await Pathway.findByIdAndDelete(req.params.pathwayId);

    res.json({ success: true, message: 'Pathway removed from project' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

