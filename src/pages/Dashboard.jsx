import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { applicationsAPI } from "../services/api";
import Logo from "../components/Logo";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected"];

const emptyForm = { companyName: "", role: "", status: "Applied", ctc: "" };

/* ── Stat card configs ─── */
const statConfig = {
  Total: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    gradient: "from-gray-500 to-gray-600",
    bg: "bg-gray-50",
    text: "text-gray-700",
  },
  Applied: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  OA: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  Interview: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  Offer: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  Rejected: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    gradient: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

/* ── Row animation ─── */
const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  /* ── Filtered + searched list ─── */
  const filteredApps = useMemo(() => {
    let list = applications;
    if (filterStatus !== "All") {
      list = list.filter((a) => a.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.companyName.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q)
      );
    }
    return list;
  }, [applications, filterStatus, searchQuery]);

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
      ctc: app.ctc || "",
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

  /* ── Stats ─── */
  const stats = [
    { label: "Total", count: applications.length },
    ...STATUSES.map((s) => ({
      label: s,
      count: applications.filter((a) => a.status === s).length,
    })),
  ];

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* ── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium text-gray-700 pr-1">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <span className="hidden sm:inline">Logout</span>
              <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ── Welcome Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {greeting}, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Here&apos;s an overview of your placement journey.
              </p>
            </div>
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Application
            </button>
          </div>
        </motion.div>

        {/* ── Stat Cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {stats.map((stat, i) => {
            const cfg = statConfig[stat.label];
            return (
              <motion.button
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                onClick={() => setFilterStatus(stat.label === "Total" ? "All" : stat.label)}
                className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 ring-1 group hover:shadow-md ${
                  (filterStatus === stat.label || (filterStatus === "All" && stat.label === "Total"))
                    ? "ring-brand-300 bg-brand-50/50 shadow-sm"
                    : "ring-gray-100 bg-white hover:ring-gray-200"
                }`}
              >
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${cfg.gradient} text-white mb-3 shadow-sm`}>
                  {cfg.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-xs font-medium text-gray-400 mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* ── Search & Filter bar ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  filterStatus === s
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white text-gray-500 hover:bg-gray-100 ring-1 ring-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Table / Content ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-[3px] border-brand-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              No applications yet
            </h3>
            <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
              Start tracking your placement journey by adding your first company application.
            </p>
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-brand-600/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Application
            </button>
          </motion.div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No applications match your filters.</p>
            <button
              onClick={() => { setFilterStatus("All"); setSearchQuery(""); }}
              className="mt-3 text-brand-600 hover:text-brand-700 text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                      Company
                    </th>
                    <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                      Role
                    </th>
                    <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                      Package (CTC)
                    </th>
                    <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                      Status
                    </th>
                    <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                      Applied On
                    </th>
                    <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence mode="popLayout">
                    {filteredApps.map((app, i) => (
                      <motion.tr
                        key={app._id}
                        custom={i}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="group hover:bg-brand-50/30 transition-colors duration-150"
                      >
                        {/* Company */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-sm font-bold flex-shrink-0">
                              {app.companyName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {app.companyName}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{app.role}</span>
                        </td>

                        {/* CTC */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {app.ctc ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="text-emerald-600 font-medium">{app.ctc}</span>
                              </span>
                            ) : (
                              <span className="text-gray-300 italic">—</span>
                            )}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={app.status} />
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleStatusChange(app._id, e.target.value)
                              }
                              className="opacity-0 group-hover:opacity-100 text-[11px] font-medium rounded-md px-1.5 py-0.5 border border-gray-200 bg-white cursor-pointer focus:ring-2 focus:ring-brand-500/20 outline-none transition-all duration-200"
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {new Date(app.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={() => openEditForm(app)}
                              className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(app._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            {/* Table footer */}
            <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50/50">
              <p className="text-xs text-gray-400">
                Showing {filteredApps.length} of {applications.length} application{applications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* ── Modal ─── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeForm}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingId ? "Edit Application" : "New Application"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {editingId ? "Update the details below" : "Fill in the details to track a new application"}
                  </p>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm ring-1 ring-red-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={form.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                        placeholder="e.g. Google, Microsoft"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Role <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="role"
                        required
                        value={form.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                        placeholder="e.g. SDE, Analyst"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Package (CTC)
                      </label>
                      <input
                        type="text"
                        name="ctc"
                        value={form.ctc}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                        placeholder="e.g. 12 LPA, $120k"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {STATUSES.map((s) => {
                          const cfg = statConfig[s];
                          const isSelected = form.status === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setForm({ ...form, status: s })}
                              className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-150 ring-1 ${
                                isSelected
                                  ? `${cfg.bg} ${cfg.text} ring-current shadow-sm`
                                  : "bg-white text-gray-400 ring-gray-200 hover:ring-gray-300 hover:text-gray-600"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="flex gap-3 pt-3 border-t border-gray-100 mt-6">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </span>
                      ) : editingId ? (
                        "Save Changes"
                      ) : (
                        "Add Application"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
