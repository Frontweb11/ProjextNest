const User = require("../models/User");
const Project = require("../models/Project");

// GET PUBLIC PORTFOLIO
const getUserPortfolio = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Get user (no password)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Get ONLY published projects
    const projects = await Project.find({
      internId: userId,
      status: "published",
      isPublic: true,
    }).sort("-createdAt");

    res.json({
      user,
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserPortfolio,
};
