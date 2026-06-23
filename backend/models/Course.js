const mongoose = require("mongoose");

/* ───────────── LESSON ───────────── */
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    resources: [
      {
        title: String,
        url: String,
      },
    ],
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: false },
);

/* ───────────── REVIEW ───────────── */
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

/* ───────────── COURSE ───────────── */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      default: "other",
    },

    tags: [String],

    lessons: [lessonSchema],

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    /* ───────────── PURCHASE SYSTEM ───────────── */
    purchasedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

/* ───────────── INDEXES ───────────── */
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1 });
courseSchema.index({ instructor: 1 });

/* ───────────── VIRTUAL ───────────── */
courseSchema.virtual("studentsCount").get(function () {
  return this.purchasedBy ? this.purchasedBy.length : 0;
});

/* ───────────── PRE SAVE ───────────── */
courseSchema.pre("save", async function () {
  if (!this.slug && this.title) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (
      await mongoose.models.Course.exists({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  this.isPremium = this.price > 0;
});

/* ───────────── METHODS ───────────── */
courseSchema.methods.enrollUser = async function (userId) {
  const exists = this.purchasedBy.some(
    (id) => id.toString() === userId.toString(),
  );

  if (!exists) {
    this.purchasedBy.push(userId);
    await this.save();
  }

  return this;
};

courseSchema.methods.removeUser = async function (userId) {
  this.purchasedBy = this.purchasedBy.filter(
    (id) => id.toString() !== userId.toString(),
  );

  await this.save();
  return this;
};

courseSchema.methods.addReview = async function (userId, rating, comment) {
  this.reviews = this.reviews.filter(
    (r) => r.user.toString() !== userId.toString(),
  );

  this.reviews.push({ user: userId, rating, comment });

  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.averageRating = this.reviews.length
    ? Number((total / this.reviews.length).toFixed(1))
    : 0;

  await this.save();
  return this;
};

/* ───────────── MODEL ───────────── */
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
