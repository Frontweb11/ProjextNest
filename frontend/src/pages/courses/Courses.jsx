// Courses.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { courseAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Star, Users, BookOpen, Plus, Sparkles, Clock } from "lucide-react";

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");
    if (paymentStatus === "success" && sessionId) {
      verifyAndEnroll(sessionId);
    } else if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled");
      setSearchParams({});
    }
  }, [searchParams]);

  const verifyAndEnroll = async (sessionId) => {
    try {
      await courseAPI.verifyPayment(sessionId);
      toast.success("Payment successful — you're enrolled!");
      fetchCourses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment verification failed",
      );
    } finally {
      setSearchParams({});
    }
  };

  const isEnrolled = (course) =>
    course.purchasedBy?.some((id) => id === user?._id || id?._id === user?._id);

  // Skeleton loader
  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" />
              Courses
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Explore and enroll in courses to boost your skills
            </p>
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/courses/create")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">
              No courses yet
            </h3>
            <p className="text-slate-500 mt-2">
              {user?.role === "admin"
                ? "Click 'Create Course' to add your first course."
                : "Check back later for new courses."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const enrolled = isEnrolled(course);
              const rating = course.averageRating || 0;
              const students = course.purchasedBy?.length || 0;
              const price = course.price === 0 ? "Free" : `$${course.price}`;

              return (
                <div
                  key={course._id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {course.title}
                      </h2>
                      {course.isPremium && (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                      {course.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      {rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {rating.toFixed(1)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {students} enrolled
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`font-bold text-lg ${
                          course.price === 0
                            ? "text-green-600"
                            : "text-slate-800"
                        }`}
                      >
                        {price}
                      </span>
                      {course.isPremium && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() =>
                        enrolled
                          ? navigate(`/courses/${course._id}/learn`)
                          : navigate(`/courses/${course._id}`)
                      }
                      className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        enrolled
                          ? "bg-slate-800 hover:bg-slate-700 text-white shadow-sm hover:shadow"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                      }`}
                    >
                      {enrolled ? "Continue Learning" : "View Course"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
