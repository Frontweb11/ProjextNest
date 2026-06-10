const PDFDocument = require("pdfkit");

const MARGIN = 45;
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const THEMES = {
  classic: { primary: "#1E3A5F", text: "#2D3748", light: "#718096" },
  modern: { primary: "#2563EB", text: "#1F2937", light: "#6B7280" },
  minimal: { primary: "#111827", text: "#374151", light: "#9CA3AF" },
  executive: { primary: "#18181B", text: "#27272A", light: "#71717A" },
  creative: { primary: "#7C3AED", text: "#1F2937", light: "#6B7280" },
  compact: { primary: "#0D9488", text: "#1F2937", light: "#6B7280" },
};

const DEFAULT_TEMPLATE = "classic";

// ─── HELPERS ────────────────────────────────────────────────
const FOOTER_SPACE = 20;

function newPageIfNeeded(doc, y, heightOrText, options = {}) {
  // Accept either a pre-computed height (number) or text + options
  const height =
    typeof heightOrText === "number"
      ? heightOrText
      : doc.heightOfString(heightOrText, { width: CONTENT_WIDTH, ...options });

  const safeBottom = PAGE_HEIGHT - MARGIN - FOOTER_SPACE;

  if (y + height > safeBottom) {
    doc.addPage();
    return MARGIN;
  }

  return y;
}

function textHeight(doc, text, options) {
  return doc.heightOfString(text, options);
}

function hr(doc, y, color, width = CONTENT_WIDTH) {
  doc
    .strokeColor(color)
    .lineWidth(0.5)
    .moveTo(MARGIN, y)
    .lineTo(MARGIN + width, y)
    .stroke();
  return y + 8;
}

// ─── SECTION TITLE (unified to match preview: uppercase, bold, thin underline) ───
function sectionTitle(doc, title, y, theme) {
  y = newPageIfNeeded(doc, y, 30);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(theme.primary)
    .text(title.toUpperCase(), MARGIN, y, { characterSpacing: 1 });
  y += 12;
  return hr(doc, y, theme.primary, CONTENT_WIDTH);
}

// ─── HEADER (classic style – matches live preview exactly) ───
function renderHeader(doc, info, theme) {
  const color = theme.primary;
  // Solid background bar like preview
  doc.rect(0, 0, PAGE_WIDTH, 95).fill(color);
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#ffffff")
    .text(info.fullName || "Your Name", MARGIN, 28);
  const contact = [info.email, info.phone, info.location].filter(Boolean);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#e2e8f0")
    .text(contact.join("  |  "), MARGIN, 60);
  const social = [
    info.linkedin && `in: ${info.linkedin}`,
    info.github && `gh: ${info.github}`,
  ].filter(Boolean);
  if (social.length) {
    doc.fontSize(8).fillColor("#cbd5e0").text(social.join("   "), MARGIN, 74);
  }
  return 110;
}

// ─── SECTIONS (simplified to match preview spacing) ───
function renderSummary(doc, text, y, theme) {
  if (!text?.trim()) return y;
  y = sectionTitle(doc, "Summary", y, theme);
  const opts = { width: CONTENT_WIDTH };
  const h = textHeight(doc, text, opts);
  y = newPageIfNeeded(doc, y, h);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(theme.text)
    .text(text.trim(), MARGIN, y, opts);
  return y + h + 12;
}

function renderExperience(doc, exp, y, theme) {
  if (!exp?.length) return y;
  y = sectionTitle(doc, "Experience", y, theme);
  for (const job of exp) {
    const role = job.role || job.title || "Position";
    const company = job.company || "";
    const heading = company ? `${role} — ${company}` : role;
    const duration =
      job.duration ||
      [job.startDate, job.endDate || "Present"].filter(Boolean).join(" – ");
    const responsibilities = (job.responsibilities || []).filter(Boolean);
    let blockHeight = 26 + (duration ? 14 : 0) + responsibilities.length * 14;
    y = newPageIfNeeded(doc, y, blockHeight);
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(theme.primary)
      .text(heading, MARGIN, y);
    y += 13;
    if (duration) {
      doc
        .font("Helvetica-Oblique")
        .fontSize(9)
        .fillColor(theme.light)
        .text(duration, MARGIN, y);
      y += 12;
    }
    for (const resp of responsibilities) {
      const bullet = `• ${resp.trim()}`;
      const h = textHeight(doc, bullet, { width: CONTENT_WIDTH - 10 });
      y = newPageIfNeeded(doc, y, h);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(theme.text)
        .text(bullet, MARGIN + 10, y, { width: CONTENT_WIDTH - 10 });
      y += h + 2;
    }
    y += 8;
  }
  return y;
}

function renderEducation(doc, edu, y, theme) {
  if (!edu?.length) return y;
  y = sectionTitle(doc, "Education", y, theme);
  for (const e of edu) {
    y = newPageIfNeeded(doc, y, 36);
    const degree = e.degree || "";
    const field = e.field || e.major || "";
    const title = field ? `${degree} in ${field}` : degree || "Degree";
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(theme.text)
      .text(title, MARGIN, y);
    y += 13;
    const school = e.school || e.institution || "";
    const years = [e.startYear, e.endYear].filter(Boolean).join(" – ");
    const info = [school, years].filter(Boolean).join("  •  ");
    if (info) {
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(theme.light)
        .text(info, MARGIN, y);
      y += 12;
    }
    y += 5;
  }
  return y;
}

function renderSkills(doc, skills, y, theme) {
  const clean = (skills || []).filter((s) => s?.trim());
  if (!clean.length) return y;
  y = sectionTitle(doc, "Skills", y, theme);
  // Use pill badges (like preview)
  let x = MARGIN;
  const pillH = 20;
  const paddingX = 10;
  doc.fontSize(8).font("Helvetica");
  for (const skill of clean) {
    const w = doc.widthOfString(skill) + paddingX * 2;
    if (x + w > PAGE_WIDTH - MARGIN) {
      x = MARGIN;
      y += pillH + 6;
    }
    doc.roundedRect(x, y, w, pillH, 3).fill(theme.primary);
    doc.fillColor("#fff").text(skill, x + paddingX, y + 6);
    x += w + 8;
  }
  return y + pillH + 14;
}

function renderProjects(doc, projects, y, theme) {
  if (!projects?.length) return y;
  y = sectionTitle(doc, "Projects", y, theme);
  for (const p of projects) {
    y = newPageIfNeeded(doc, y, 45);
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(theme.primary)
      .text(p.name || "Project", MARGIN, y);
    y += 13;
    const stack = Array.isArray(p.techStack)
      ? p.techStack.filter(Boolean).join(", ")
      : p.techStack || "";
    if (stack) {
      doc
        .font("Helvetica-Oblique")
        .fontSize(9)
        .fillColor(theme.light)
        .text(stack, MARGIN, y);
      y += 12;
    }
    if (p.description) {
      const opts = { width: CONTENT_WIDTH };
      const h = textHeight(doc, p.description, opts);
      y = newPageIfNeeded(doc, y, h);
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(theme.text)
        .text(p.description, MARGIN, y, opts);
      y += h + 4;
    }
    if (p.link) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(theme.light)
        .text(p.link, MARGIN, y);
      y += 12;
    }
    y += 6;
  }
  return y;
}

function renderCertifications(doc, certs, y, theme) {
  if (!certs?.length) return y;
  y = sectionTitle(doc, "Certifications", y, theme);
  for (const c of certs) {
    y = newPageIfNeeded(doc, y, 28);
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(theme.text)
      .text(c.name || "Certification", MARGIN, y);
    y += 13;
    const sub = [c.issuer, c.year].filter(Boolean).join(", ");
    if (sub) {
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(theme.light)
        .text(sub, MARGIN, y);
      y += 12;
    }
    y += 4;
  }
  return y;
}
function addPageNumbers(doc, theme) {
  const range = doc.bufferedPageRange();

  if (!range || typeof range.count !== "number") return;

  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(theme.light || "#999")
      .text(`Page ${i + 1} of ${range.count}`, MARGIN, PAGE_HEIGHT - 30, {
        width: CONTENT_WIDTH,
        align: "right",
      });
  }
}

// ─── TRIM TRAILING BLANK PAGES ─────────────────────────────
function trimBlankPages(doc) {
  const range = doc.bufferedPageRange();
  if (!range || range.count < 2) return;

  const pages = doc._pageBuffer;
  if (!pages || pages.length < 2) return;

  const lastPage = pages[pages.length - 1];
  if (lastPage && lastPage.content && lastPage.content.length < 50) {
    pages.pop();
    doc._pageBufferStart = range.start;
  }
}

// ─── MAIN BUILDER ──────────────────────────────────────────
const buildResumePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const templateName = THEMES[data.template]
        ? data.template
        : DEFAULT_TEMPLATE;
      const theme = THEMES[templateName];
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 0, bottom: 0, left: 0, right: 0 }, // ← CHANGE THIS
        bufferPages: true,
        info: {
          Title: `${data.personalInfo?.fullName || "Resume"} — Resume`,
          Author: data.personalInfo?.fullName || "Unknown",
          Creator: "ProjectNest Resume Builder",
        },
      });
      const buffers = [];
      doc.on("data", (chunks) => buffers.push(chunks));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      let y = renderHeader(doc, data.personalInfo || {}, theme);
      y = renderSummary(doc, data.summary, y, theme);
      y = renderExperience(doc, data.experience, y, theme);
      y = renderEducation(doc, data.education, y, theme);
      y = renderSkills(doc, data.skills, y, theme);
      y = renderProjects(doc, data.projects, y, theme);
      y = renderCertifications(doc, data.certifications, y, theme);

      addPageNumbers(doc, theme);
      trimBlankPages(doc); // ← ADD THIS CALL HERE
      doc.end();
    } catch (err) {
      console.error("❌ PDFKit build error:", err);
      reject(err);
    }
  });
};

module.exports = { buildResumePDF, THEMES };
