import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ProjectsForm = ({ items, onChange }) => {
  const addProject = () => {
    onChange([
      ...items,
      { name: "", description: "", techStack: "", link: "" },
    ]);
  };

  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    onChange(newItems);
  };

  const remove = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={addProject}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 rounded-lg"
        >
          + Add
        </button>
      </div>
      {items.map((proj, idx) => (
        <div key={idx} className="relative p-4 border rounded-xl">
          <button
            onClick={() => remove(idx)}
            className="absolute top-3 right-3 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              placeholder="Project name *"
              value={proj.name}
              onChange={(e) => update(idx, "name", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
            <input
              placeholder="Tech stack (e.g. React, Express)"
              value={proj.techStack}
              onChange={(e) => update(idx, "techStack", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
            <textarea
              placeholder="Description"
              rows="2"
              value={proj.description}
              onChange={(e) => update(idx, "description", e.target.value)}
              className="col-span-2 rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
            <input
              placeholder="Live demo URL"
              value={proj.link}
              onChange={(e) => update(idx, "link", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsForm;
