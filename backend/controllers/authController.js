const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user (intern or admin)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, socialLinks } = req.body;

    // ✅ VALIDATION (THIS FIXES YOUR ERROR)
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "intern",
      bio: bio || "",
      socialLinks: socialLinks || {},
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error.message);

    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
    // In your login controller (backend)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Must be true for cross-site cookies (requires HTTPS)
      sameSite: "none", // Crucial for cross-origin requests
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.body.profilePicture)
      updates.profilePicture = req.body.profilePicture;
    if (req.body.socialLinks && typeof req.body.socialLinks === "object") {
      updates.socialLinks = {
        linkedin: req.body.socialLinks.linkedin || "",
        github: req.body.socialLinks.github || "",
        website: req.body.socialLinks.website || "",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      socialLinks: updatedUser.socialLinks,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/auth/upload-profile
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const cloudinary = require("../config/cloudinary");
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_pictures",
          transformation: { width: 300, height: 300, crop: "fill" },
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      const Readable = require("stream").Readable;
      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    await User.findByIdAndUpdate(req.user._id, {
      profilePicture: result.secure_url,
    });

    res.json({ profilePicture: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadProfilePicture,
};
