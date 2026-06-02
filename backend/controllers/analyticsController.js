const User = require("../models/User");
const Project = require("../models/Project");

// @desc    Get platform stats
// @route   GET /api/analytics/stats
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterns = await User.countDocuments({ role: "intern" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalProjects = await Project.countDocuments();
    const totalPublishedProjects = await Project.countDocuments({
      status: "published",
      isPublic: true,
    });
    const totalViews = await Project.aggregate([
      { $group: { _id: null, total: { $sum: "$viewCount" } } },
    ]);
    const pendingProjects = await Project.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalInterns,
      totalAdmins,
      totalProjects,
      totalPublishedProjects,
      totalViews: totalViews[0]?.total || 0,
      pendingProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top projects (most viewed)
// @route   GET /api/analytics/top-projects
const getTopProjects = async (req, res) => {
  try {
    const topProjects = await Project.find({
      isPublic: true,
      status: "published",
    })
      .sort("-viewCount")
      .limit(10)
      .populate("internId", "name email");
    res.json(topProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get intern performance (projects count, total views, avg per intern)
// @route   GET /api/analytics/intern-performance
const getInternPerformance = async (req, res) => {
  try {
    const interns = await User.find({ role: "intern", isActive: true }).select(
      "name email profilePicture bio",
    );
    const performance = [];
    for (const intern of interns) {
      const projects = await Project.find({
        internId: intern._id,
        isPublic: true,
      });
      const totalViews = projects.reduce((sum, p) => sum + p.viewCount, 0);
      performance.push({
        intern: {
          id: intern._id,
          name: intern.name,
          email: intern.email,
          profilePicture: intern.profilePicture,
        },
        projectCount: projects.length,
        totalViews,
        averageViews: projects.length
          ? (totalViews / projects.length).toFixed(2)
          : 0,
      });
    }
    // Sort by totalViews descending
    performance.sort((a, b) => b.totalViews - a.totalViews);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tag usage statistics
// @route   GET /api/analytics/tags
const getTagStats = async (req, res) => {
  try {
    const result = await Project.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlatformStats,
  getTopProjects,
  getInternPerformance,
  getTagStats,
};
