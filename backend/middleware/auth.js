const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

// ─── Middleware ───────────────────────────────────────────────────────────────

const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — no token provided",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Session expired — please log in again"
          : "Invalid token";
      return res.status(401).json({ success: false, message });
    }

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account no longer exists",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated — contact support",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Authentication failed — please try again",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied — admin only",
    });
  }

  next();
};

module.exports = { protect, adminOnly };
