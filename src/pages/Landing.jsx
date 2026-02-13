import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: "📋",
    title: "Track Applications",
    desc: "Keep a clear record of every company you've applied to in one place.",
  },
  {
    icon: "📊",
    title: "Status Updates",
    desc: "Move through stages — Applied, OA, Interview, Offer, or Rejected.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Your data is yours alone. Secured with JWT authentication.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 -z-10" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-100/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium mb-8 ring-1 ring-brand-200"
          >
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            Built for final-year students
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight"
          >
            Track your placement
            <br />
            <span className="text-brand-600">journey, clearly.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Stay organized through every stage of your placement process. From
            applications to offers — track it all in one minimal, focused
            dashboard.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5"
            >
              Get Started — it&apos;s free
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-all ring-1 ring-gray-200 hover:ring-gray-300 hover:-translate-y-0.5"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              A simple, focused tool to keep your placement journey on track.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group relative bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-100 hover:shadow-md hover:ring-gray-200 transition-all duration-300"
              >
                <div className="text-4xl mb-5">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-12 sm:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <h2 className="relative text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get organized?
            </h2>
            <p className="relative text-brand-100 text-lg mb-8 max-w-lg mx-auto">
              Join students who are tracking their placement journey the smart way.
            </p>
            <Link
              to="/signup"
              className="relative inline-flex items-center px-8 py-3.5 text-base font-semibold text-brand-700 bg-white hover:bg-brand-50 rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              Start Tracking Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PlacementTracker. Built with purpose.
          </p>
        </div>
      </footer>
    </div>
  );
}
