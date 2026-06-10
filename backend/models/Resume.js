const mongoose = require("mongoose");

// ─────────────────────────────
// CONSTANTS
// ─────────────────────────────
const ALLOWED_TEMPLATES = ["classic", "modern", "minimal"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
const YEAR_REGEX = /^(\d{4}|Present|present|Current|current)$/;

// ─────────────────────────────
// PERSONAL INFO
// ─────────────────────────────
const personalInfoSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Invalid email format"],
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },

    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
      match: [URL_REGEX, "LinkedIn must be a valid URL"],
    },

    github: {
      type: String,
      default: "",
      trim: true,
      match: [URL_REGEX, "GitHub must be a valid URL"],
    },
  },
  { _id: false },
);

// ─────────────────────────────
// EDUCATION
// ─────────────────────────────
const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
      maxlength: [150, "School name cannot exceed 150 characters"],
    },

    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
      maxlength: [100, "Degree cannot exceed 100 characters"],
    },

    field: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Field of study cannot exceed 100 characters"],
    },

    startYear: {
      type: String,
      default: "",
      trim: true,
      match: [YEAR_REGEX, "startYear must be a 4-digit year or 'Present'"],
    },

    endYear: {
      type: String,
      default: "Present",
      trim: true,
      match: [YEAR_REGEX, "endYear must be a 4-digit year or 'Present'"],
    },
  },
  { _id: false },
);

// ─────────────────────────────
// EXPERIENCE
// ─────────────────────────────
const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },

    duration: {
      type: String,
      default: "",
      trim: true,
      maxlength: [50, "Duration cannot exceed 50 characters"],
    },

    responsibilities: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "Each responsibility must be a non-empty string",
      },
    },
  },
  { _id: false },
);

// ─────────────────────────────
// PROJECTS
// ─────────────────────────────
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Project description cannot exceed 500 characters"],
    },

    techStack: {
      type: [String], // ← Changed: array is far more useful than a single string
      default: [],
    },

    link: {
      type: String,
      default: "",
      trim: true,
      match: [URL_REGEX, "Project link must be a valid URL"],
    },
  },
  { _id: false },
);

// ─────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────
const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Certification name is required"],
      trim: true,
      maxlength: [150, "Certification name cannot exceed 150 characters"],
    },

    issuer: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Issuer cannot exceed 100 characters"],
    },

    year: {
      type: String,
      default: "",
      trim: true,
      match: [/^\d{4}$/, "Certification year must be a 4-digit year"],
    },
  },
  { _id: false },
);

// ─────────────────────────────
// MAIN RESUME SCHEMA
// ─────────────────────────────
const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    personalInfo: {
      type: personalInfoSchema,
      required: [true, "Personal info is required"],
    },

    summary: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Summary cannot exceed 1000 characters"],
    },

    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },

    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "Each skill must be a non-empty string",
      },
    },

    template: {
      type: String,
      enum: {
        values: ALLOWED_TEMPLATES,
        message: `Template must be one of: ${ALLOWED_TEMPLATES.join(", ")}`,
      },
      default: "classic",
    },

    accentColor: {
      type: String,
      default: "#2563EB",
      trim: true,
      match: [
        HEX_COLOR_REGEX,
        "accentColor must be a valid hex color (e.g. #FFF or #2563EB)",
      ],
    },

    isPublic: {
      type: Boolean, // ← New: lets users share a read-only link later
      default: false,
    },

    exportCount: { type: Number, default: 0, min: 0 },
    lastExportedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─────────────────────────────
// VIRTUALS
// ─────────────────────────────

// Convenience flag — no extra DB field needed
resumeSchema.virtual("hasBeenExported").get(function () {
  return this.exportCount > 0;
});

// ─────────────────────────────
// METHODS
// ─────────────────────────────
resumeSchema.methods.recordExport = async function () {
  this.exportCount += 1;
  this.lastExportedAt = new Date();
  return this.save();
};

// ─────────────────────────────
// STATICS
// ─────────────────────────────

// Returns the most recently updated resume for a user
resumeSchema.statics.findByUser = function (userId) {
  return this.findOne({ user: userId }).sort({ updatedAt: -1 });
};

// Bump export count atomically — safer than the instance method under concurrency
resumeSchema.statics.incrementExport = function (resumeId) {
  return this.findByIdAndUpdate(
    resumeId,
    { $inc: { exportCount: 1 }, $set: { lastExportedAt: new Date() } },
    { new: true },
  );
};

// ─────────────────────────────
// INDEXES
// ─────────────────────────────
resumeSchema.index({ user: 1, updatedAt: -1 });
resumeSchema.index({ user: 1, template: 1 }); // ← Useful for filtering by template per user

module.exports = mongoose.model("Resume", resumeSchema);
