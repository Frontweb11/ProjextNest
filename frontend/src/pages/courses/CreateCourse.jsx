// CreateCourse.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { courseAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  ChevronLeft,
  GripVertical,
  Sparkles,
} from "lucide-react";

const emptyLesson = () => ({
  title: "",
  content: "",
  videoUrl: "",
  isPremium: false,
});

const CreateCourse = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    isPremium: false,
  });

  const [lessons, setLessons] = useState([emptyLesson()]);
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLessonChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    setLessons((prev) =>
      prev.map((l, i) =>
        i === idx ? { ...l, [name]: type === "checkbox" ? checked : value } : l,
      ),
    );
  };

  const addLesson = () => setLessons((prev) => [...prev, emptyLesson()]);

  const removeLesson = (idx) => {
    if (lessons.length === 1)
      return toast.error("At least one lesson required");
    setLessons((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveLesson = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= lessons.length) return;
    setLessons((prev) => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (lessons.some((l) => !l.title.trim()))
      return toast.error("All lessons must have a title");

    setSubmitting(true);
    try {
      await courseAPI.create({
        ...form,
        price: Number(form.price),
        lessons,
      });
      toast.success("Course created!");
      navigate("/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Create Course
        </h1>

        {/* Course Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Course Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="e.g. Introduction to React"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="What will students learn?"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  min={0}
                  placeholder="0 for free"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPremium"
                  name="isPremium"
                  checked={form.isPremium}
                  onChange={handleFormChange}
                  className="w-5 h-5 accent-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="isPremium"
                  className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Premium Course
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Builder Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Lessons</h2>
            <span className="text-xs text-slate-400 bg-gray-100 px-3 py-1 rounded-full">
              {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 bg-slate-50 hover:border-blue-200 transition relative"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveLesson(idx, -1)}
                      disabled={idx === 0}
                      className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveLesson(idx, 1)}
                      disabled={idx === lessons.length - 1}
                      className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Lesson {idx + 1}
                  </span>
                  <button
                    onClick={() => removeLesson(idx)}
                    className="ml-auto text-slate-300 hover:text-red-500 transition"
                    title="Remove lesson"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Lesson Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(idx, e)}
                      placeholder="e.g. Getting Started"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Video URL
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={lesson.videoUrl}
                      onChange={(e) => handleLessonChange(idx, e)}
                      placeholder="YouTube or direct video link"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Text Content
                    </label>
                    <textarea
                      name="content"
                      value={lesson.content}
                      onChange={(e) => handleLessonChange(idx, e)}
                      placeholder="Written content, notes, or description..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`lesson-premium-${idx}`}
                      name="isPremium"
                      checked={lesson.isPremium}
                      onChange={(e) => handleLessonChange(idx, e)}
                      className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`lesson-premium-${idx}`}
                      className="text-xs font-medium text-slate-600 cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      Premium lesson
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addLesson}
            className="mt-4 w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl py-3 text-sm font-medium text-slate-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Lesson
          </button>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-slate-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition shadow-sm hover:shadow disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCourse;
