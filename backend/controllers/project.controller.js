const Project = require('../models/Project');
const Workspace = require('../models/Workspace'); // Import Workspace model
const Folder = require('../models/Folder'); // Import Folder model
const Pathway = require('../models/Pathway'); // Import Pathway model
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .populate('owner', 'name email')
      .populate('workspace', 'name');
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

// @desc    Get projects by workspace
// @route   GET /api/workspaces/:workspaceId/projects
// @access  Private
exports.getProjectsByWorkspace = async (req, res, next) => {
  try {
    const projects = await Project.find({ workspace: req.params.workspaceId, owner: req.user.id })
      .populate('owner', 'name email')
      .populate('workspace', 'name');
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
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
    next(err);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('workspace', 'name')
      .populate('folders')
      .populate('pathways');

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Check for user authorization based on visibility
    if (project.visibility === 'private' && project.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }
    // For 'workspace' visibility, check if user is a member of the associated workspace
    if (project.visibility === 'workspace' && project.workspace) {
      const workspace = await Workspace.findById(project.workspace);
      if (!workspace || !workspace.members.some(member => member.user.toString() === req.user.id)) {
        return next(new ErrorResponse('User not authorized to view this project', 401));
      }
    }


    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  const { name, description, visibility } = req.body;

  // Build project object
  const projectFields = {};
  if (name) projectFields.name = name;
  if (description) projectFields.description = description;
  if (visibility) projectFields.visibility = visibility;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Make sure user owns the project
    if (project.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized', 401));
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    // Remove project from associated workspace
    if (project.workspace) {
      await Workspace.findByIdAndUpdate(project.workspace, { $pull: { projects: project._id } });
    }

    // Delete associated folders and pathways
    await Folder.deleteMany({ project: project._id });
    await Pathway.deleteMany({ project: project._id });

    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project removed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get project tree
// @route   GET /api/projects/:id/tree
// @access  Private
exports.getProjectTree = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('folders')
      .populate('pathways');

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete folder from project
// @route   DELETE /api/projects/:projectId/folders/:folderId
// @access  Private
exports.deleteFolderFromProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    // Remove folder from project's folders array
    project.folders = project.folders.filter(
      (folder) => folder.toString() !== req.params.folderId
    );
    await project.save();

    // Delete the folder itself
    await Folder.findByIdAndDelete(req.params.folderId);

    res.status(200).json({ success: true, message: 'Folder removed from project' });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete pathway from project
// @route   DELETE /api/projects/:projectId/pathways/:pathwayId
// @access  Private
exports.deletePathwayFromProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    // Check for user
    if (project.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('User not authorized', 401));
    }

    // Remove pathway from project's pathways array
    project.pathways = project.pathways.filter(
      (pathway) => pathway.toString() !== req.params.pathwayId
    );
    await project.save();

    // Delete the pathway itself
    await Pathway.findByIdAndDelete(req.params.pathwayId);

    res.status(200).json({ success: true, message: 'Pathway removed from project' });
  } catch (err) {
    next(err);
  }
};

