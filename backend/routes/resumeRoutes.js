const express = require("express");
const router = express.Router();
const { generateResumePDF } = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

// POST /api/resume/generate-pdf
router.post("/generate-pdf", protect, generateResumePDF);

module.exports = router;
