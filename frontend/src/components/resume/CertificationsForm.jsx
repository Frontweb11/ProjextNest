import React from "react";
import { Plus, Trash2 } from "lucide-react";

const CertificationsForm = ({ items, onChange }) => {
  const add = () => onChange([...items, { name: "", issuer: "", year: "" }]);
  const update = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    onChange(newItems);
  };
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Certifications</h2>
        <button
          onClick={add}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 rounded-lg"
        >
          + Add
        </button>
      </div>
      {items.map((cert, idx) => (
        <div key={idx} className="relative p-4 border rounded-xl">
          <button
            onClick={() => remove(idx)}
            className="absolute top-3 right-3 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              placeholder="Certification name *"
              value={cert.name}
              onChange={(e) => update(idx, "name", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
            <input
              placeholder="Issuer (e.g. Google)"
              value={cert.issuer}
              onChange={(e) => update(idx, "issuer", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
            <input
              placeholder="Year"
              value={cert.year}
              onChange={(e) => update(idx, "year", e.target.value)}
              className="rounded-lg border px-3 py-2 dark:bg-gray-700"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CertificationsForm;
