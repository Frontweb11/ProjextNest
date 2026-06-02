const User = require("../models/User");
const Project = require("../models/Project");

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort("-createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user by ID (admin)
// @route   GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user (admin) – change role, disable/enable, etc.
// @route   PUT /api/admin/users/:id
const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, role, isActive, bio, socialLinks } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    if (bio !== undefined) updates.bio = bio;
    if (socialLinks) updates.socialLinks = socialLinks;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects (admin view, includes non-public, all interns)
// @route   GET /api/admin/projects
const getAllProjectsAdmin = async (req, res) => {
  try {
    const { status, intern, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (intern) query.internId = intern;

    const projects = await Project.find(query)
      .populate("internId", "name email")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project status (admin approve/reject)
// @route   PUT /api/admin/projects/:id/status
const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["draft", "published", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    project.status = status;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete any project (admin)
// @route   DELETE /api/admin/projects/:id
const deleteProjectByAdmin = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    // Delete images from Cloudinary
    const cloudinary = require("../config/cloudinary");
    for (const img of project.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }
    await project.deleteOne();
    res.json({ message: "Project deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllProjectsAdmin,
  updateProjectStatus,
  deleteProjectByAdmin,
};
