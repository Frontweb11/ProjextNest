const Course = require("../models/Course");

// ---------------- GET ALL COURSES ----------------
const getCourses = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: "published" };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .select("-reviews")
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET SINGLE COURSE ----------------
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("reviews.user", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- CREATE COURSE (Instructor/Admin) ----------------
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, tags, thumbnail, lessons } =
      req.body;

    const course = await Course.create({
      title,
      description,
      price,
      category,
      tags,
      thumbnail,
      lessons,
      instructor: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- UPDATE COURSE ----------------
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only the instructor who created it (or admin) can update
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const fields = [
      "title",
      "description",
      "price",
      "category",
      "tags",
      "thumbnail",
      "lessons",
      "status",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    const updated = await course.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- DELETE COURSE ----------------
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- ENROLL / PURCHASE COURSE ----------------
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const alreadyEnrolled = course.purchasedBy.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (alreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // NOTE: For paid courses, payment verification should happen
    // BEFORE this point (e.g. via a payment webhook or middleware).
    // This assumes payment is already confirmed when this runs.

    await course.enrollUser(req.user._id);

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- ADD REVIEW ----------------
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = course.purchasedBy.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (!isEnrolled) {
      return res
        .status(403)
        .json({ message: "You must be enrolled to review this course" });
    }

    await course.addReview(req.user._id, rating, comment);

    res.json({ message: "Review added successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET MY ENROLLED COURSES ----------------
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ purchasedBy: req.user._id }).select(
      "-reviews",
    );

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const stripe = require("../utils/stripeClient");

// ---------------- CREATE CHECKOUT SESSION (Premium courses) ----------------
const createCheckoutSession = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.price === 0) {
      return res
        .status(400)
        .json({ message: "This course is free — use enroll instead" });
    }

    const alreadyEnrolled = course.purchasedBy.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description.slice(0, 200),
            },
            unit_amount: Math.round(course.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: course._id.toString(),
        userId: req.user._id.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/courses?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/courses?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- VERIFY PAYMENT (called from frontend after redirect) ----------------
const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const { courseId, userId } = session.metadata;

    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "User mismatch" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.enrollUser(userId);

    res.json({ message: "Payment verified and enrolled", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
