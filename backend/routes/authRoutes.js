const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  uploadProfilePicture,
  forgotPassword, // 👈 import new
  resetPassword, // 👈 import new
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// PUBLIC ROUTES
router.post("/register", register);
router.post("/login", login);

// ─── Forgot Password Routes ────────────────────────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// PROTECTED ROUTES
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// upload profile image
router.post(
  "/upload-profile",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture,
);

module.exports = router;
