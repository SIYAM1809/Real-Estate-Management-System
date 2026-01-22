import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaShieldAlt, FaRegClock, FaMapMarkedAlt } from "react-icons/fa";

function Home() {
  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-noise">
      <div className="container-shell py-14 sm:py-20">
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
          {/* floating blobs */}
          <motion.div
            aria-hidden
            className="absolute -top-10 -left-10 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl"
            animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute top-10 right-0 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl"
            animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <motion.div variants={item} className="flex flex-wrap gap-2 mb-5">
                <span className="chip">Verified listings</span>
                <span className="chip">Admin approval workflow</span>
                <span className="chip">Map-first experience</span>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900"
              >
                Find your next property{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                  with confidence
                </span>
              </motion.h1>

              <motion.p variants={item} className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl">
                A secure marketplace for Buyers, Sellers, and Admins — with map-based discovery, fast filtering,
                and email notifications for inquiries and actions.
              </motion.p>

              <motion.div variants={item} className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/properties" className="btn-soft px-6 py-3 text-base">
                  Browse Properties <FaArrowRight className="ml-2" />
                </Link>
                <Link to="/register" className="btn-outline px-6 py-3 text-base">
                  Join Now
                </Link>
              </motion.div>

              <motion.div variants={item} className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                {[
                  { k: "Role-based", v: "Buyer / Seller / Admin" },
                  { k: "Map", v: "Location-based view" },
                  { k: "Email", v: "Inquiry notifications" },
                ].map((s) => (
                  <div key={s.k} className="card p-4">
                    <div className="text-xs font-bold text-slate-500 uppercase">{s.k}</div>
                    <div className="mt-1 text-sm font-extrabold text-slate-900">{s.v}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right */}
            <motion.div variants={item} className="card p-6 sm:p-8 shadow-soft">
              <div className="text-sm font-bold text-slate-900">Why SyntaxEstate feels premium</div>
              <p className="mt-2 text-sm text-slate-600">
                Smooth interactions, clean spacing, and subtle motion — the UI stays fast and readable.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <FaShieldAlt />, title: "Secure", desc: "Auth + protected routes" },
                  { icon: <FaMapMarkedAlt />, title: "Map", desc: "Accurate location display" },
                  { icon: <FaRegClock />, title: "Fast", desc: "Quick filtering experience" },
                ].map((f) => (
                  <motion.div
                    key={f.title}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      {f.icon}
                    </div>
                    <div className="mt-3 font-extrabold text-slate-900">{f.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{f.desc}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500 uppercase">Pro tip</div>
                <div className="mt-1 text-sm text-slate-700">
                  Use filtering + map view on listings to shortlist properties faster.
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
