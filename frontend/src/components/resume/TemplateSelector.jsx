import React from "react";
import PropTypes from "prop-types";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional, professional",
    preview: "🗂️",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean with bold accents",
    preview: "✨",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, elegant",
    preview: "🪄",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold and authoritative",
    preview: "💼",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with color",
    preview: "🎨",
  },
  {
    id: "compact",
    name: "Compact",
    description: "More content, less space",
    preview: "📋",
  },
];

const TemplateSelector = ({ selected, onChange }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Choose Template
      </h2>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        role="radiogroup"
        aria-label="Resume template"
      >
        {TEMPLATES.map((tpl) => {
          const isSelected = selected === tpl.id;

          return (
            <button
              key={tpl.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(tpl.id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border-2
                text-left transition-all duration-200 focus:outline-none
                focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
              `}
            >
              <span className="text-2xl" aria-hidden="true">
                {tpl.preview}
              </span>

              <div className="text-center">
                <div
                  className={`font-semibold text-sm ${
                    isSelected
                      ? "text-indigo-700 dark:text-indigo-300"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {tpl.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {tpl.description}
                </div>
              </div>

              {isSelected && (
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  ✓ Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

TemplateSelector.propTypes = {
  selected: PropTypes.oneOf(TEMPLATES.map((t) => t.id)).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TemplateSelector;
export { TEMPLATES };
