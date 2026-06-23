// CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { courseAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Star,
  Users,
  BookOpen,
  Lock,
  PlayCircle,
  CheckCircle,
  ChevronLeft,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await courseAPI.getById(id);
        setCourse(res.data);
      } catch {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isEnrolled = () =>
    course?.purchasedBy?.some((e) => e === user?._id || e?._id === user?._id);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      if (course.price === 0) {
        await courseAPI.enroll(course._id);
        toast.success("Enrolled successfully!");
        const res = await courseAPI.getById(id);
        setCourse(res.data);
      } else {
        const res = await courseAPI.checkout(course._id);
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return toast.error("Review cannot be empty");
    setSubmittingReview(true);
    try {
      await courseAPI.addReview(id, {
        rating: reviewRating,
        comment: reviewText,
      });
      toast.success("Review submitted!");
      setReviewText("");
      setReviewRating(5);
      const res = await courseAPI.getById(id);
      setCourse(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const completedCount =
    course?.lessons?.filter((l) =>
      l.completedBy?.some((uid) => uid === user?._id || uid?._id === user?._id),
    ).length ?? 0;
  const totalLessons = course?.lessons?.length ?? 0;
  const progressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const enrolled = isEnrolled();

  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-64" />
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-48" />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-72" />
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

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-1">
                {course.isPremium && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </span>
                )}
                {course.price === 0 && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Free
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-800">
                {course.title}
              </h1>
              <p className="text-slate-600 mt-3 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                {course.averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {course.averageRating.toFixed(1)}
                    <span className="text-slate-400">
                      ({course.reviews?.length || 0} reviews)
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.purchasedBy?.length || 0} enrolled
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {totalLessons} lessons
                </span>
              </div>
            </div>

            {/* Lessons list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Course Content
              </h2>
              {totalLessons === 0 ? (
                <p className="text-slate-400 text-sm">No lessons yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {course.lessons.map((lesson, idx) => {
                    const done = lesson.completedBy?.some(
                      (uid) => uid === user?._id || uid?._id === user?._id,
                    );
                    const accessible = enrolled || !lesson.isPremium;
                    const Icon = done
                      ? CheckCircle
                      : accessible
                        ? PlayCircle
                        : Lock;

                    return (
                      <li
                        key={lesson._id ?? idx}
                        className="flex items-center gap-3 py-3 hover:bg-slate-50 px-3 -mx-3 rounded-lg transition"
                      >
                        <span className="text-xs text-slate-400 w-6 text-right font-medium">
                          {idx + 1}
                        </span>
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            done
                              ? "text-green-500"
                              : accessible
                                ? "text-blue-500"
                                : "text-gray-300"
                          }`}
                        />
                        <span
                          className={`text-sm flex-1 ${
                            !accessible ? "text-slate-400" : "text-slate-700"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        {!accessible && (
                          <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                            Premium
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Reviews</h2>

              {enrolled && (
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Leave a Review
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setReviewRating(star)}>
                        <Star
                          className={`w-5 h-5 transition ${
                            star <= reviewRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <button
                    onClick={handleReviewSubmit}
                    disabled={submittingReview}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}

              {course.reviews?.length > 0 ? (
                <ul className="space-y-4">
                  {course.reviews.map((r, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                        {r.user?.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {r.user?.name ?? "User"}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= r.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {r.comment}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Right column - sticky card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-800">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
                {course.isPremium && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>

              {enrolled ? (
                <>
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {completedCount} / {totalLessons} completed
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/courses/${id}/learn`)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-medium transition shadow-sm hover:shadow"
                  >
                    Continue Learning
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition shadow-sm hover:shadow disabled:opacity-50"
                >
                  {enrolling
                    ? course.price === 0
                      ? "Enrolling..."
                      : "Redirecting..."
                    : course.price === 0
                      ? "Enroll Free"
                      : "Buy Now"}
                </button>
              )}

              <div className="border-t border-gray-200 pt-4 text-sm text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Lessons</span>
                  <span>{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students</span>
                  <span>{course.purchasedBy?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
