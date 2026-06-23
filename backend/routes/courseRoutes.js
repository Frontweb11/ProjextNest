const express = require("express");

const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addReview,
  getMyCourses,
  createCheckoutSession,
  verifyPayment,
} = require("../controllers/courseController");

const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// ---------------- PUBLIC ----------------
router.get("/", getCourses);

// ---------------- PROTECTED (interns + admins) — must come BEFORE "/:id" ----------------
router.get("/my/enrolled", protect, getMyCourses);
router.post("/verify-payment", protect, verifyPayment);

// ---------------- PUBLIC (dynamic param — must come AFTER specific paths) ----------------
router.get("/:id", getCourseById);

// ---------------- PROTECTED (interns + admins) ----------------
router.post("/:id/enroll", protect, enrollCourse);
router.post("/:id/review", protect, addReview);
router.post("/:id/checkout", protect, createCheckoutSession);

// ---------------- ADMIN ONLY ----------------
router.post("/", protect, adminOnly, createCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

module.exports = router;
