import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaBars, FaTimes, FaSignOutAlt, FaUser, FaTachometerAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const dashboardLink = user?.role === "admin"
    ? "/admin-dashboard"
    : user?.role === "seller"
      ? "/seller-dashboard"
      : "/dashboard";

  const dashboardLabel = user?.role === "admin" ? "Admin" : user?.role === "seller" ? "Seller" : "Dashboard";

  const navItemClass = ({ isActive }) =>
    `text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:text-primary-600 hover:bg-slate-50"
    }`;

  const rightBlock = useMemo(() => {
    if (user) {
      return (
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end text-xs">
            <span className="text-slate-500">Welcome back,</span>
            <span className="font-bold text-slate-800">{user.name}</span>
          </div>

          <Link to={dashboardLink} className="btn-primary space-x-2">
            <FaTachometerAlt />
            <span>{dashboardLabel}</span>
          </Link>

          <button
            onClick={onLogout}
            className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Logout"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-ghost font-semibold">
          <FaUser className="mr-2 text-slate-400" />
          Login
        </Link>
        <Link to="/register" className="btn-primary shadow-lg shadow-primary-500/30">
          Get Started
        </Link>
      </div>
    );
  }, [user, dashboardLink, dashboardLabel]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm" : "bg-transparent py-2"
        }`}
    >
      <div className="container-shell flex items-center justify-between py-3">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-105">
            <FaBuilding className="text-xl" />
          </div>
          <div className="leading-tight">
            <div className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary-700 transition-colors">
              Syntax<span className="text-primary-600">Estate</span>
            </div>
            <div className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">Premium Real Estate</div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-white/50 shadow-sm">
          <NavLink to="/" className={navItemClass}>Home</NavLink>
          <NavLink to="/properties" className={navItemClass}>Properties</NavLink>
        </div>

        {/* RIGHT BLOCK */}
        <div className="hidden md:block">{rightBlock}</div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden btn-ghost p-2 text-slate-600"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="container-shell py-6 space-y-4">
              <NavLink to="/" className="block text-base font-medium text-slate-600 hover:text-primary-600" onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/properties" className="block text-base font-medium text-slate-600 hover:text-primary-600" onClick={() => setOpen(false)}>
                Properties
              </NavLink>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                {rightBlock}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
