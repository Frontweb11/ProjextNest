import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

// ─── TEMPLATES DATA (fully defined) ──────────────────────────────────────────
const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    preview: "📄",
    description: "Traditional and professional, perfect for corporate roles.",
  },
  {
    id: "modern",
    name: "Modern",
    preview: "✨",
    description: "Clean, contemporary design with accent colors.",
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "⬜",
    description: "Simple, elegant, and distraction‑free.",
  },
  {
    id: "executive",
    name: "Executive",
    preview: "👔",
    description: "Bold and authoritative for senior positions.",
  },
  {
    id: "creative",
    name: "Creative",
    preview: "🎨",
    description: "Stand out with a vibrant, artistic layout.",
  },
  {
    id: "compact",
    name: "Compact",
    preview: "📐",
    description: "Maximizes content in a small space.",
  },
];

const PREVIEW_STYLES = {
  classic:
    "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800",
  modern:
    "bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40",
  minimal:
    "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
  executive:
    "bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black",
  creative:
    "bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40",
  compact:
    "bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40",
};

const TemplateCard = ({ tpl }) => (
  <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div
      className={`h-48 flex flex-col items-center justify-center gap-2 ${PREVIEW_STYLES[tpl.id] ?? "bg-gray-100 dark:bg-gray-700"}`}
      aria-hidden="true"
    >
      <span className="text-4xl">{tpl.preview}</span>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
        {tpl.name}
      </span>
    </div>
    <div className="flex flex-col flex-1 p-5 gap-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {tpl.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {tpl.description}
        </p>
      </div>
      <div className="mt-auto">
        <Link
          to="/resume/builder"
          state={{ template: tpl.id }}
          className="inline-block w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Use this template
        </Link>
      </div>
    </div>
  </div>
);

const ResumeTemplates = () => (
  <Layout>
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Choose Your Template
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Select a design and start building your resume.
        </p>
      </div>
      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="Resume templates"
      >
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} role="listitem">
            <TemplateCard tpl={tpl} />
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default ResumeTemplates;
