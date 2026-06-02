const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllProjectsAdmin,
  updateProjectStatus,
  deleteProjectByAdmin,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);

// Project management
router.get("/projects", getAllProjectsAdmin);
router.put("/projects/:id/status", updateProjectStatus);
router.delete("/projects/:id", deleteProjectByAdmin);

module.exports = router;
