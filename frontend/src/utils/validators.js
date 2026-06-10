// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d+\-\s()]+$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;
const YEAR_REGEX = /^(\d{4}|Present|Current)$/i;
const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

// ─── Primitives ───────────────────────────────────────────────────────────────

export const validateEmail = (email) => EMAIL_REGEX.test(email);
export const validateURL = (url) => !url || URL_REGEX.test(url); // optional field
export const validateYear = (year) => !year || YEAR_REGEX.test(year);

// ─── Personal Info ────────────────────────────────────────────────────────────

export const validatePersonalInfo = (data = {}) => {
  const errors = {};

  if (!data.fullName?.trim()) errors.fullName = "Full name is required";
  else if (data.fullName.trim().length < 2)
    errors.fullName = "Full name must be at least 2 characters";

  if (!data.email?.trim()) errors.email = "Email is required";
  else if (!validateEmail(data.email)) errors.email = "Invalid email address";

  if (data.phone && !PHONE_REGEX.test(data.phone))
    errors.phone = "Phone number contains invalid characters";

  if (data.linkedin && !validateURL(data.linkedin))
    errors.linkedin = "LinkedIn must be a valid URL";

  if (data.github && !validateURL(data.github))
    errors.github = "GitHub must be a valid URL";

  return errors;
};

// ─── Education ────────────────────────────────────────────────────────────────

export const validateEducation = (edu = []) => {
  const errors = [];

  edu.forEach((item, idx) => {
    const e = {};

    if (!item.school?.trim()) e.school = "School is required";
    if (!item.degree?.trim()) e.degree = "Degree is required";

    // field is optional — removed the incorrect required check from the original
    if (item.startYear && !validateYear(item.startYear))
      e.startYear = "Start year must be a valid 4-digit year";

    if (item.endYear && !validateYear(item.endYear))
      e.endYear = "End year must be a valid 4-digit year or 'Present'";

    if (Object.keys(e).length) errors[idx] = e;
  });

  return errors;
};

// ─── Experience ───────────────────────────────────────────────────────────────

export const validateExperience = (experience = []) => {
  const errors = [];

  experience.forEach((item, idx) => {
    const e = {};

    if (!item.company?.trim()) e.company = "Company name is required";
    if (!item.role?.trim()) e.role = "Role is required";

    if (item.responsibilities?.some((r) => typeof r !== "string"))
      e.responsibilities = "Each responsibility must be a string";

    if (Object.keys(e).length) errors[idx] = e;
  });

  return errors;
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const validateProjects = (projects = []) => {
  const errors = [];

  projects.forEach((item, idx) => {
    const e = {};

    if (!item.name?.trim()) e.name = "Project name is required";

    if (item.link && !validateURL(item.link))
      e.link = "Project link must be a valid URL";

    if (Object.keys(e).length) errors[idx] = e;
  });

  return errors;
};

// ─── Certifications ───────────────────────────────────────────────────────────

export const validateCertifications = (certs = []) => {
  const errors = [];

  certs.forEach((item, idx) => {
    const e = {};

    if (!item.name?.trim()) e.name = "Certification name is required";

    if (item.year && !/^\d{4}$/.test(item.year))
      e.year = "Year must be a 4-digit number";

    if (Object.keys(e).length) errors[idx] = e;
  });

  return errors;
};

// ─── Skills ───────────────────────────────────────────────────────────────────

export const validateSkills = (skills = []) => {
  const errors = {};
  if (skills.some((s) => !s?.trim()))
    errors.skills = "Skills cannot contain empty entries";
  return errors;
};

// ─── Accent Color ─────────────────────────────────────────────────────────────

export const validateAccentColor = (color) => {
  if (!color) return null;
  return HEX_REGEX.test(color)
    ? null
    : "Accent color must be a valid hex (e.g. #2563EB)";
};

// ─── Full Resume ──────────────────────────────────────────────────────────────

/**
 * Validates the entire resume payload.
 * Returns an object where each key is only present if that section has errors.
 */
export const validateResume = (data = {}) => {
  const errors = {};

  const personalErrors = validatePersonalInfo(data.personalInfo);
  if (Object.keys(personalErrors).length) errors.personalInfo = personalErrors;

  const eduErrors = validateEducation(data.education);
  if (eduErrors.length) errors.education = eduErrors;

  const expErrors = validateExperience(data.experience);
  if (expErrors.length) errors.experience = expErrors;

  const projErrors = validateProjects(data.projects);
  if (projErrors.length) errors.projects = projErrors;

  const certErrors = validateCertifications(data.certifications);
  if (certErrors.length) errors.certifications = certErrors;

  const skillErrors = validateSkills(data.skills);
  if (Object.keys(skillErrors).length) errors.skills = skillErrors;

  const colorError = validateAccentColor(data.accentColor);
  if (colorError) errors.accentColor = colorError;

  return errors;
};

export const isResumeValid = (data) =>
  Object.keys(validateResume(data)).length === 0;
