import React, { useState } from "react";
import { resumeAPI } from "../../services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ALLOWED_TEMPLATES = [
  "classic",
  "modern",
  "minimal",
  "executive",
  "creative",
  "compact",
];

const sanitizeFileName = (name) =>
  (name || "resume")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase()
    .slice(0, 100) || "resume";

const buildPayload = (resumeData) => ({
  ...resumeData,
  template: ALLOWED_TEMPLATES.includes(resumeData.template)
    ? resumeData.template
    : "classic",
  experience: (resumeData.experience ?? []).map((exp) => ({
    role: exp.role || exp.title || "Position",
    company: exp.company || "",
    duration: exp.duration || "",
    startDate: exp.startDate || "",
    endDate: exp.endDate || "",
    responsibilities: Array.isArray(exp.responsibilities)
      ? exp.responsibilities.filter(Boolean)
      : [],
  })),
});

const triggerDownload = (blobData, fileName) => {
  const url = window.URL.createObjectURL(
    new Blob([blobData], { type: "application/pdf" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 5000);
};

// ─── Component ────────────────────────────────────────────────────────────────

const ExportButton = ({ resumeData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    if (!resumeData?.personalInfo?.fullName?.trim()) {
      setError("Please enter your full name before exporting.");
      return;
    }
    if (!resumeData?.personalInfo?.email?.trim()) {
      setError("Please enter your email before exporting.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = buildPayload(resumeData);
      const fileName =
        sanitizeFileName(resumeData.personalInfo.fullName) + ".pdf";

      const response = await resumeAPI.generatePDF(payload);

      const contentType = response.headers?.["content-type"] ?? "";
      if (!contentType.includes("application/pdf")) {
        const text = await response.data.text?.();
        let message = "Server returned an unexpected response.";
        try {
          message = JSON.parse(text)?.message ?? message;
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }

      triggerDownload(response.data, fileName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("❌ PDF export error:", err);
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          setError(json?.message ?? "PDF generation failed. Please try again.");
        } catch {
          setError("PDF generation failed. Please try again.");
        }
      } else {
        setError(err.message || "PDF generation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleExport}
        disabled={loading}
        aria-busy={loading}
        aria-label={
          loading ? "Generating PDF, please wait" : "Export resume as PDF"
        }
        className={`
          inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
          transition-colors duration-200 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-offset-2
          ${
            loading
              ? "bg-green-400 cursor-not-allowed text-white focus-visible:ring-green-400"
              : success
                ? "bg-green-500 text-white focus-visible:ring-green-500"
                : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white focus-visible:ring-green-600"
          }
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Generating…
          </>
        ) : success ? (
          <>✓ Downloaded!</>
        ) : (
          <>⬇ Export PDF</>
        )}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default ExportButton;
