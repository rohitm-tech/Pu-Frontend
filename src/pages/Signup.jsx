import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";
import Logo from "../components/Logo";

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.signup(form);
      onLogin(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 to-brand-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <Link to="/">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-extrabold">
                PT
              </div>
              PlacementTracker
            </div>
          </Link>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Start your journey.
            <br />
            <span className="text-brand-200">Track every step.</span>
          </h2>
          <p className="mt-4 text-brand-100 text-lg max-w-md">
            Create an account and get a clear view of your entire placement
            process.
          </p>
        </div>
        <div className="relative text-brand-200 text-sm">
          &copy; {new Date().getFullYear()} PlacementTracker
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-500">
            Sign up to start tracking your placements.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm ring-1 ring-red-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
