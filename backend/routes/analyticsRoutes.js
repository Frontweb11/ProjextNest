const express = require("express");
const router = express.Router();
const {
  getPlatformStats,
  getTopProjects,
  getInternPerformance,
  getTagStats,
} = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/auth");

// All analytics routes require admin access
router.use(protect, adminOnly);

router.get("/stats", getPlatformStats);
router.get("/top-projects", getTopProjects);
router.get("/intern-performance", getInternPerformance);
router.get("/tags", getTagStats);

module.exports = router;
