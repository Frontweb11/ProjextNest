import React from "react";
// 1. Cleaned import - completely removed Linkedin and Github to stop the crashes
import { User, Mail, Phone, MapPin } from "lucide-react";

const PersonalInfoForm = ({ data, onChange, errors }) => {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="inline w-4 h-4 mr-1" /> Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={data.fullName || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors?.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Mail className="inline w-4 h-4 mr-1" /> Email *
          </label>
          <input
            type="email"
            name="email"
            value={data.email || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
          />
          {errors?.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Phone className="inline w-4 h-4 mr-1" /> Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="inline w-4 h-4 mr-1" /> Location
          </label>
          <input
            type="text"
            name="location"
            value={data.location || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {/* 2. Inline SVG for LinkedIn */}
            <svg
              className="inline w-4 h-4 mr-1 text-gray-500 dark:text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </label>
          <input
            type="url"
            name="linkedin"
            value={data.linkedin || ""}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {/* 3. Inline SVG for GitHub */}
            <svg
              className="inline w-4 h-4 mr-1 text-gray-500 dark:text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            GitHub
          </label>
          <input
            type="url"
            name="github"
            value={data.github || ""}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
