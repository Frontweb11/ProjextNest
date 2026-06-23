// CourseLearn.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { courseAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  FileText,
  Lock,
  Award,
  Sparkles,
} from "lucide-react";

const LessonContent = ({ lesson }) => {
  const isVideo =
    lesson.videoUrl &&
    (lesson.videoUrl.includes("youtube.com") ||
      lesson.videoUrl.includes("youtu.be") ||
      lesson.videoUrl.includes("vimeo.com") ||
      lesson.videoUrl.match(/\.(mp4|webm|ogg)$/i));

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  return (
    <div>
      {lesson.videoUrl && (
        <div className="mb-6">
          {isVideo &&
          (lesson.videoUrl.includes("youtube") ||
            lesson.videoUrl.includes("vimeo")) ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
              <iframe
                src={getEmbedUrl(lesson.videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          ) : (
            <video
              src={lesson.videoUrl}
              controls
              className="w-full rounded-xl bg-black shadow-lg"
            />
          )}
        </div>
      )}

      {lesson.content && (
        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
          {lesson.content}
        </div>
      )}

      {!lesson.videoUrl && !lesson.content && (
        <p className="text-slate-400 italic">No content for this lesson yet.</p>
      )}
    </div>
  );
};

const CourseLearn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markingDone, setMarkingDone] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await courseAPI.getById(id);
        setCourse(res.data);
        const firstIncomplete = res.data.lessons?.findIndex(
          (l) =>
            !l.completedBy?.some(
              (uid) => uid === user?._id || uid?._id === user?._id,
            ),
        );
        if (firstIncomplete !== -1) setActiveIdx(firstIncomplete ?? 0);
      } catch {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isCompleted = (lesson) =>
    lesson.completedBy?.some(
      (uid) => uid === user?._id || uid?._id === user?._id,
    );

  const isEnrolled = () =>
    course?.purchasedBy?.some((e) => e === user?._id || e?._id === user?._id);

  const handleMarkComplete = async () => {
    const lesson = course.lessons[activeIdx];
    setMarkingDone(true);
    try {
      await courseAPI.markComplete(id, lesson._id);
      const res = await courseAPI.getById(id);
      setCourse(res.data);
      toast.success("Lesson completed!");
      if (activeIdx < course.lessons.length - 1) {
        setActiveIdx((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark complete");
    } finally {
      setMarkingDone(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 animate-pulse">
          <div className="flex h-[calc(100vh-64px)]">
            <div className="w-72 bg-white border-r border-gray-200 p-4 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-full" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="aspect-video bg-gray-200 rounded-xl" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="p-6 text-red-500">Course not found.</div>
      </Layout>
    );
  }

  if (!isEnrolled()) {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto text-center">
          <Lock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">
            Access Restricted
          </h2>
          <p className="text-slate-500 mt-2">
            Enroll in this course to access lessons.
          </p>
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition"
          >
            View Course Details
          </button>
        </div>
      </Layout>
    );
  }

  const lessons = course.lessons ?? [];
  const activeLesson = lessons[activeIdx];
  const completed = activeLesson ? isCompleted(activeLesson) : false;
  const completedCount = lessons.filter(isCompleted).length;
  const progressPct =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 overflow-hidden border-r bg-white flex flex-col shrink-0`}
        >
          <div className="p-4 border-b">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Course Details
            </button>
            <h2 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
              {course.title}
            </h2>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>
                  {completedCount}/{lessons.length} complete
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <ul className="overflow-y-auto flex-1 py-2">
            {lessons.map((lesson, idx) => {
              const done = isCompleted(lesson);
              const active = idx === activeIdx;
              const hasVideo = !!lesson.videoUrl;
              const Icon = done ? CheckCircle : active ? PlayCircle : Circle;

              return (
                <li key={lesson._id ?? idx}>
                  <button
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                      active ? "bg-blue-50 border-r-2 border-blue-600" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <Icon
                        className={`w-4 h-4 ${
                          done
                            ? "text-green-500"
                            : active
                              ? "text-blue-500"
                              : "text-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          active ? "text-blue-700" : "text-slate-700"
                        }`}
                      >
                        {idx + 1}. {lesson.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        {hasVideo ? (
                          <>
                            <PlayCircle className="w-3 h-3" /> Video
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3" /> Reading
                          </>
                        )}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-6 py-3 border-b bg-white shrink-0 shadow-sm">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="text-slate-500 hover:text-slate-800 transition"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <span className="text-sm text-slate-500">
              Lesson {activeIdx + 1} of {lessons.length}
            </span>
            {course.isPremium && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full ml-auto">
                <Sparkles className="w-3 h-3" />
                Premium
              </span>
            )}
          </div>

          {/* Lesson content */}
          <div className="flex-1 p-6 max-w-4xl w-full mx-auto">
            {activeLesson ? (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                  {activeLesson.title}
                </h1>

                <LessonContent lesson={activeLesson} />

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setActiveIdx((p) => Math.max(0, p - 1))}
                    disabled={activeIdx === 0}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-3">
                    {completed ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={handleMarkComplete}
                        disabled={markingDone}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50 shadow-sm hover:shadow"
                      >
                        {markingDone ? "Saving..." : "Mark as Complete"}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setActiveIdx((p) => Math.min(lessons.length - 1, p + 1))
                    }
                    disabled={activeIdx === lessons.length - 1}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 transition"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-slate-400">No lessons available.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseLearn;
