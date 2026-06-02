import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
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
                Showcase your
                <br />
                projects professionally
              </h2>
              <p className="text-indigo-100 text-lg">
                Join a community of interns building their portfolio to impress
                employers.
              </p>
            </div>
            <div className="mt-12">
              <img
                src="https://undraw.co/api/illustrations/undraw_developer_activity_re_9eac.svg"
                alt="Developer workspace"
                className="w-full max-w-md mx-auto opacity-90"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Login Form */}
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

              <h2 className="text-2xl font-bold text-white mb-2 text-center lg:text-left">
                Welcome back
              </h2>
              <p className="text-indigo-200 mb-8 text-center lg:text-left">
                Sign in to manage your portfolio
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                      placeholder="••••••"
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

                {/* Forgot password */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-300 hover:text-white transition"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* Create account link */}
              <p className="mt-8 text-center text-indigo-200">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-white font-semibold hover:underline"
                >
                  Create account
                </Link>
              </p>

              {/* Demo credentials hint (optional, for easier testing) */}
              <div className="mt-6 p-3 bg-white/5 rounded-lg text-xs text-indigo-300 text-center">
                Demo: admin@example.com / admin123 &nbsp;|&nbsp; Create an
                intern account via "Create account"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
