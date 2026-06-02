const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");

// ================= PUBLIC ROUTES (NO LOGIN REQUIRED) =================

// @route   GET /api/users/public-profiles
// @desc    Get all users for the public Explore directory page
// @access  Public
router.get("/public-profiles", async (req, res) => {
  try {
    // Only select public-safe fields to show on the marketplace grid
    const profiles = await User.find().select("name role bio profilePicture");

    res.json(profiles);
  } catch (error) {
    // Matches your exact error formatting style
    res.status(500).json({ message: error.message });
  }
});

// PUBLIC PORTFOLIO API
// Keeps your exact queries, 'internId' structure, and 'published' status check
router.get("/portfolio/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({
      internId: req.params.id,
      status: "published",
    });

    res.json({
      user,
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
