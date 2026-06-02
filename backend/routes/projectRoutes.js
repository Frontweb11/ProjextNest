const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteImage,
} = require("../controllers/projectController");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// ================= PUBLIC ROUTES =================
// Anyone can see the global list of high-level project snippets
router.get("/", getProjects);

// ================= PROTECTED ROUTES (LOGIN REQUIRED) =================
router.use(protect);

// Moved here so only logged-in users can pull full, deep-dive project data
router.get("/:id", getProjectById);

// Existing protected routes
router.get("/my/projects", getMyProjects);
router.post("/", upload.array("images", 5), createProject);
router.put("/:id", upload.array("images", 5), updateProject);
router.delete("/:id", deleteProject);
router.delete("/:id/images/:imageId", deleteImage);

module.exports = router;
