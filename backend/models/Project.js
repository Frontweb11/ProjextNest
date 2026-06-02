const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    demoUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "pending", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Index for searching by tags or title
projectSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Project", projectSchema);
