import React from "react";
import { Plus, Trash2 } from "lucide-react";

const EducationForm = ({ items, onChange }) => {
  const addItem = () => {
    onChange([
      ...items,
      { school: "", degree: "", field: "", startYear: "", endYear: "" },
    ]);
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    onChange(newItems);
  };

  const removeItem = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Education
        </h2>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-6 text-gray-400 border border-dashed rounded-lg">
          No education entries. Click “Add” to start.
        </div>
      )}

      {items.map((edu, idx) => (
        <div
          key={idx}
          className="relative p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50"
        >
          <button
            onClick={() => removeItem(idx)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="School / University *"
              value={edu.school}
              onChange={(e) => updateItem(idx, "school", e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2"
            />
            <input
              placeholder="Degree *"
              value={edu.degree}
              onChange={(e) => updateItem(idx, "degree", e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2"
            />
            <input
              placeholder="Field of Study *"
              value={edu.field}
              onChange={(e) => updateItem(idx, "field", e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2"
            />
            <div className="flex gap-2">
              <input
                placeholder="Start Year"
                value={edu.startYear}
                onChange={(e) => updateItem(idx, "startYear", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2"
              />
              <input
                placeholder="End Year"
                value={edu.endYear}
                onChange={(e) => updateItem(idx, "endYear", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationForm;
