import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "intern",
      });
      navigate("/dashboard");
    } catch (err) {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#2e1065] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT COLUMN: Illustration & Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-12 flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-indigo-600 font-bold text-xl">P</span>
                </div>
                <span className="text-white font-bold text-xl tracking-tight">
                  ProjectNest
                </span>
              </div>
              <h2 className="text-white text-4xl font-bold mb-4 leading-tight">
                Start your
                <br />
                professional journey
              </h2>
              <p className="text-indigo-100 text-lg">
                Create an account to showcase your projects, build your
                portfolio, and impress recruiters.
              </p>
            </div>
            <div className="mt-12">
              <img
                src="https://illustrations.popsy.com/illustration/team-collaboration-6.svg"
                alt="Team collaboration"
                className="w-full max-w-md mx-auto opacity-90"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Registration Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Mobile logo */}
              <div className="flex justify-center lg:hidden mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-indigo-600 font-bold text-xl">P</span>
                  </div>
                  <span className="text-white font-bold text-xl tracking-tight">
                    ProjectNest
                  </span>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white mb-6 transition"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="text-sm">Back to login</span>
              </Link>

              <h2 className="text-2xl font-bold text-white mb-2">
                Create account
              </h2>
              <p className="text-indigo-200 mb-8">
                Join ProjectNest and start showcasing your work
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Full name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                      placeholder="•••••• (min 6 characters)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                      placeholder="••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Register button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              {/* Login link */}
              <p className="mt-8 text-center text-indigo-200">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
