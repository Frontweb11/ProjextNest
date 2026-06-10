const cors = require("cors");

// ─── Allowed Origins ──────────────────────────────────────────────────────────

const PRODUCTION_ORIGINS = [
  "https://projext-nest.vercel.app",
  "https://projext-nest-git-main-frontweb11s-projects.vercel.app",
];

const DEVELOPMENT_ORIGINS = ["http://localhost:5173", "http://localhost:3000"];

const getAllowedOrigins = () => {
  const origins = [...PRODUCTION_ORIGINS];
  if (process.env.NODE_ENV !== "production") {
    origins.push(...DEVELOPMENT_ORIGINS);
  }
  // Support injecting extra origins via environment variable
  // e.g. ALLOWED_ORIGINS=https://staging.example.com,https://preview.example.com
  if (process.env.ALLOWED_ORIGINS) {
    const extra = process.env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    origins.push(...extra);
  }
  return origins;
};

// ─── Origin Validator ─────────────────────────────────────────────────────────

const originValidator = (origin, callback) => {
  // Allow server-to-server requests (no Origin header)
  if (!origin) return callback(null, true);

  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  console.warn(`🚫 CORS blocked origin: ${origin}`);
  return callback(
    Object.assign(new Error("Not allowed by CORS"), { status: 403 }),
  );
};

// ─── CORS Config ──────────────────────────────────────────────────────────────

const corsOptions = {
  origin: originValidator,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["Content-Disposition", "Content-Length"],
  maxAge: 86400, // Cache preflight for 24 hours (reduces OPTIONS round-trips)
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
