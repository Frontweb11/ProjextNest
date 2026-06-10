import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";

import PersonalInfoForm from "../components/resume/PersonalInfoForm";
import EducationForm from "../components/resume/EducationForm";
import ExperienceForm from "../components/resume/ExperienceForm";
import SkillsForm from "../components/resume/SkillsForm";
import ProjectsForm from "../components/resume/ProjectsForm";
import CertificationsForm from "../components/resume/CertificationsForm";
import TemplateSelector from "../components/resume/TemplateSelector";
import ExportButton from "../components/resume/ExportButton";
import ResumePreview from "../components/resume/ResumePreview";

import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_STATE = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  template: "classic",
  accentColor: "#2563EB", // ✅ KEPT for functionality
};

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "template", label: "Template" },
];

const STORAGE_KEY = "resumeBuilderData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mergeSaved = (saved) => ({
  ...INITIAL_STATE,
  ...saved,
  personalInfo: { ...INITIAL_STATE.personalInfo, ...saved?.personalInfo },
  template: saved?.template || INITIAL_STATE.template,
  accentColor: saved?.accentColor || INITIAL_STATE.accentColor,
});

// ─── Component ────────────────────────────────────────────────────────────────

const ResumeBuilder = () => {
  const location = useLocation();

  const [resumeData, setResumeData] = useState(() => {
    const saved = loadFromLocalStorage(STORAGE_KEY);
    const base = saved ? mergeSaved(saved) : { ...INITIAL_STATE };
    if (location.state?.template) {
      base.template = location.state.template;
    }
    return base;
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // ── Persist to localStorage ──────────────────────────────────────────────

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      saveToLocalStorage(STORAGE_KEY, resumeData);
      setLastSaved(new Date());
      setIsDirty(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [resumeData, isDirty]);

  // ── Updater ──────────────────────────────────────────────────────────────

  const updateSection = useCallback((section, value) => {
    setResumeData((prev) => ({ ...prev, [section]: value }));
    setIsDirty(true);
  }, []);

  const handleReset = () => {
    if (!window.confirm("Clear all resume data and start over?")) return;
    setResumeData({ ...INITIAL_STATE });
    saveToLocalStorage(STORAGE_KEY, INITIAL_STATE);
    setActiveTab("personal");
    toast.success("Resume cleared.");
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Resume Builder
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Build and export a professional resume in seconds.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleReset}
                className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-4 rounded-xl mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Live Resume Builder</p>
              <p className="text-xs opacity-80 mt-0.5">
                Fill in the tabs → preview updates live → export as PDF
              </p>
            </div>
            {isDirty && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Unsaved changes…
              </span>
            )}
          </div>

          {/* Tabs */}
          <div
            className="flex flex-wrap gap-2 mb-6"
            role="tablist"
            aria-label="Resume sections"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors duration-150
                  ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left — Form */}
            <div
              id={`tabpanel-${activeTab}`}
              role="tabpanel"
              aria-label={activeTab}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
            >
              {activeTab === "personal" && (
                <PersonalInfoForm
                  data={resumeData.personalInfo}
                  onChange={(val) => updateSection("personalInfo", val)}
                />
              )}

              {activeTab === "education" && (
                <EducationForm
                  items={resumeData.education}
                  onChange={(val) => updateSection("education", val)}
                />
              )}

              {activeTab === "experience" && (
                <ExperienceForm
                  items={resumeData.experience}
                  onChange={(val) => updateSection("experience", val)}
                />
              )}

              {activeTab === "skills" && (
                <SkillsForm
                  skills={resumeData.skills}
                  onChange={(val) => updateSection("skills", val)}
                />
              )}

              {activeTab === "projects" && (
                <ProjectsForm
                  items={resumeData.projects}
                  onChange={(val) => updateSection("projects", val)}
                />
              )}

              {activeTab === "certifications" && (
                <CertificationsForm
                  items={resumeData.certifications}
                  onChange={(val) => updateSection("certifications", val)}
                />
              )}

              {activeTab === "template" && (
                <div className="space-y-6">
                  <TemplateSelector
                    selected={resumeData.template}
                    onChange={(val) => updateSection("template", val)}
                  />

                  {/* 🎨 ACCENT COLOR UI REMOVED — functionality stays */}
                  {/* The accentColor value still exists in state and will be used by PDF builder */}

                  <ExportButton resumeData={resumeData} />
                </div>
              )}
            </div>

            {/* Right — Live preview (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                  Live Preview
                </p>
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                />
              </div>
            </div>
          </div>

          {/* Mobile preview */}
          <div className="lg:hidden mt-6">
            <details className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800">
              <summary className="px-4 py-3 cursor-pointer font-medium text-sm text-gray-800 dark:text-gray-200 select-none">
                Show Live Preview
              </summary>
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                />
              </div>
            </details>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilder;
