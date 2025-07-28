/**
 * @file dashboard.controller.js
 * @description This file contains the controller functions for dashboard related operations.
 */

const Project = require('../models/Project');
const Workspace = require('../models/Workspace');
const Pathway = require('../models/Pathway');

/**
 * @function getDashboardStats
 * @description Get dashboard statistics for the authenticated user.
 * @route GET /api/dashboard/stats
 * @access Private
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total workspaces owned by the user
    const totalWorkspaces = await Workspace.countDocuments({ owner: userId });

    // Get total projects owned by the user
    const totalProjects = await Project.countDocuments({ owner: userId });

    // Get total completed pathways (assuming a 'completed' field in Pathway model)
    // This might need adjustment based on the actual Pathway model structure
    const completedPathways = await Pathway.countDocuments({ owner: userId, completed: true });

    // Fetch recent activities (example: last 5 created projects or workspaces)
    const recentProjects = await Project.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt');

    const recentWorkspaces = await Workspace.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name createdAt');

    const recentActivities = [
      ...recentProjects.map(p => ({ description: `Created project: ${p.name}`, timestamp: p.createdAt })),
      ...recentWorkspaces.map(w => ({ description: `Created workspace: ${w.name}`, timestamp: w.createdAt })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: {
        totalWorkspaces,
        totalProjects,
        completedPathways,
        recentActivities,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
