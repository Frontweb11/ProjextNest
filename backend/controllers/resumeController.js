const { buildResumePDF } = require("../utils/pdfBuilder");

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TEMPLATES = [
  "classic",
  "modern",
  "minimal",
  "executive",
  "creative",
  "compact",
];

const validateResumeData = (data) => {
  const errors = [];

  if (!data || typeof data !== "object") {
    return ["Request body must be a valid JSON object"];
  }

  // Personal info
  const { personalInfo } = data;
  if (!personalInfo || typeof personalInfo !== "object") {
    errors.push("personalInfo object is required");
  } else {
    if (!personalInfo.fullName?.trim()) {
      errors.push("personalInfo.fullName is required");
    } else if (personalInfo.fullName.trim().length < 2) {
      errors.push("personalInfo.fullName must be at least 2 characters");
    }

    if (!personalInfo.email?.trim()) {
      errors.push("personalInfo.email is required");
    } else if (!EMAIL_REGEX.test(personalInfo.email.trim())) {
      errors.push("personalInfo.email must be a valid email address");
    }
  }

  // Template
  if (data.template && !ALLOWED_TEMPLATES.includes(data.template)) {
    errors.push(`template must be one of: ${ALLOWED_TEMPLATES.join(", ")}`);
  }

  // Optional sections — validate structure only if provided
  if (data.experience !== undefined && !Array.isArray(data.experience)) {
    errors.push("experience must be an array");
  }

  if (data.education !== undefined && !Array.isArray(data.education)) {
    errors.push("education must be an array");
  }

  if (data.skills !== undefined && !Array.isArray(data.skills)) {
    errors.push("skills must be an array");
  }

  return errors;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sanitizeFileName = (name) =>
  (name || "resume")
    .trim()
    .replace(/[^\w\s-]/g, "") // strip special chars
    .replace(/\s+/g, "_")
    .toLowerCase()
    .slice(0, 100) || // cap filename length
  "resume"; // fallback if sanitization wipes the string

// ─── Controller ───────────────────────────────────────────────────────────────

const generateResumePDF = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        errors: ["Request body is empty"],
      });
    }

    const errors = validateResumeData(data);
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const pdfBuffer = await buildResumePDF(data);

    // Guard: ensure pdfBuilder actually returned a buffer
    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
      throw new Error("pdfBuilder returned an invalid buffer");
    }

    const fileName = sanitizeFileName(data.personalInfo.fullName);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.pdf"`,
    );

    return res.end(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF generation error:", err);

    // Distinguish client-caused errors from server faults
    const isClientError =
      err.message?.toLowerCase().includes("invalid") ||
      err.message?.toLowerCase().includes("unsupported");

    return res.status(isClientError ? 422 : 500).json({
      success: false,
      message: "PDF generation failed",
      ...(process.env.NODE_ENV !== "production" && { error: err.message }),
    });
  }
};

module.exports = { generateResumePDF };
