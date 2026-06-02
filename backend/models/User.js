const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = Object.freeze({ INTERN: "intern", ADMIN: "admin" });
const URL_REGEX = /^https?:\/\/.+/;

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // excluded by default; use .select("+password") when needed
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.INTERN,
    },

    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
      validate: {
        validator: (v) => v === "" || URL_REGEX.test(v),
        message: "Profile picture must be a valid URL",
      },
    },

    socialLinks: {
      linkedin: {
        type: String,
        default: "",
        validate: {
          validator: (v) => v === "" || URL_REGEX.test(v),
          message: "LinkedIn must be a valid URL",
        },
      },
      github: {
        type: String,
        default: "",
        validate: {
          validator: (v) => v === "" || URL_REGEX.test(v),
          message: "GitHub must be a valid URL",
        },
      },
      website: {
        type: String,
        default: "",
        validate: {
          validator: (v) => v === "" || URL_REGEX.test(v),
          message: "Website must be a valid URL",
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ─── Middleware ───────────────────────────────────────────────────────────────

// ─── Middleware ───────────────────────────────────────────────────────────────

// Hash password before saving (only when modified)
// ─── Middleware ───────────────────────────────────────────────────────────────

// ✅ async keyword present
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Methods ──────────────────────────────────────────────────────────────────

/**
 * Compare a plaintext password against the stored hash.
 * Requires the document to have been fetched with .select("+password").
 */
userSchema.methods.comparePassword = async function (candidate) {
  if (!candidate || typeof candidate !== "string") {
    throw new Error("Invalid password input");
  }
  if (!this.password) {
    throw new Error(
      "Password not loaded — use .select('+password') on your query",
    );
  }
  return bcrypt.compare(candidate, this.password);
};

// ─── Statics ──────────────────────────────────────────────────────────────────

/**
 * Find an active user by email and include their password for auth flows.
 * @param {string} email
 */
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select("+password");
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
