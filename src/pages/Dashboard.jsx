import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { applicationsAPI } from "../services/api";
import Logo from "../components/Logo";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected"];

const emptyForm = { companyName: "", role: "", status: "Applied" };

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      const { data } = await applicationsAPI.getAll();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (app) => {
    setForm({
      companyName: app.companyName,
      role: app.role,
      status: app.status,
    });
    setEditingId(app._id);
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        await applicationsAPI.update(editingId, form);
      } else {
        await applicationsAPI.create(form);
      }
      closeForm();
      await fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await applicationsAPI.delete(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await applicationsAPI.update(id, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  // Stats
  const stats = STATUSES.map((s) => ({
    label: s,
    count: applications.filter((a) => a.status === s).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Hi, <span className="font-medium text-gray-700">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and manage your placement applications.
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Application
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 ring-1 ring-gray-100 shadow-sm"
            >
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.count}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900">
              No applications yet
            </h3>
            <p className="text-gray-500 mt-1 mb-6">
              Start by adding your first company application.
            </p>
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Application
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">
                      Company
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">
                      Role
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">
                      Date
                    </th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence>
                    {applications.map((app) => (
                      <motion.tr
                        key={app._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900 text-sm">
                            {app.companyName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {app.role}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app._id, e.target.value)
                            }
                            className="text-xs font-medium rounded-full px-2 py-1 border-0 bg-transparent cursor-pointer focus:ring-2 focus:ring-brand-500/20 outline-none"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditForm(app)}
                              className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(app._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeForm}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId ? "Edit Application" : "Add Application"}
                </h2>
                <button
                  onClick={closeForm}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm ring-1 ring-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                    placeholder="e.g. Google"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : editingId ? (
                      "Update"
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
