import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ExperienceForm = ({ items, onChange }) => {
  const addItem = () => {
    onChange([
      ...items,
      { company: "", role: "", duration: "", responsibilities: [""] },
    ]);
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    onChange(newItems);
  };

  const updateResponsibility = (idx, respIdx, value) => {
    const newItems = [...items];
    newItems[idx].responsibilities[respIdx] = value;
    onChange(newItems);
  };

  const addResponsibility = (idx) => {
    const newItems = [...items];
    newItems[idx].responsibilities.push("");
    onChange(newItems);
  };

  const removeResponsibility = (idx, respIdx) => {
    const newItems = [...items];
    newItems[idx].responsibilities.splice(respIdx, 1);
    onChange(newItems);
  };

  const removeItem = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h2>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {items.map((exp, idx) => (
        <div
          key={idx}
          className="relative p-4 border rounded-xl bg-white dark:bg-gray-800/50"
        >
          <button
            onClick={() => removeItem(idx)}
            className="absolute top-3 right-3 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Company *"
              value={exp.company}
              onChange={(e) => updateItem(idx, "company", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
            <input
              placeholder="Role *"
              value={exp.role}
              onChange={(e) => updateItem(idx, "role", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
            <input
              placeholder="Duration (e.g. Jan 2022 – Present)"
              value={exp.duration}
              onChange={(e) => updateItem(idx, "duration", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
          </div>
          <label className="block text-sm font-medium mb-1">
            Responsibilities
          </label>
          {exp.responsibilities.map((resp, ridx) => (
            <div key={ridx} className="flex gap-2 mb-2">
              <input
                value={resp}
                onChange={(e) =>
                  updateResponsibility(idx, ridx, e.target.value)
                }
                placeholder="e.g. Developed REST APIs"
                className="flex-1 rounded-lg border px-3 py-2 dark:bg-gray-700"
              />
              <button
                onClick={() => removeResponsibility(idx, ridx)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => addResponsibility(idx)}
            className="text-sm text-indigo-600 mt-1"
          >
            + Add responsibility
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
