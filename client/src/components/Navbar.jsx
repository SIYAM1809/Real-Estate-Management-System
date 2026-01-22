import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaBars, FaTimes, FaSignOutAlt, FaUser } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "seller"
      ? "/seller-dashboard"
      : "/dashboard";

  const dashboardLabel =
    user?.role === "admin" ? "Admin Panel" : user?.role === "seller" ? "Seller Panel" : "Dashboard";

  const navItemClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
    }`;

  const rightBlock = useMemo(() => {
    if (user) {
      return (
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-slate-500">
            Hello, <span className="font-bold text-slate-800">{user.name}</span>
          </span>

          <Link to={dashboardLink} className="btn-soft">
            {dashboardLabel}
          </Link>

          <button
            onClick={onLogout}
            className="btn-outline text-red-600 border-red-200 hover:bg-red-50"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-outline">
          <FaUser className="mr-2" />
          Login
        </Link>
        <Link to="/register" className="btn-soft">
          Register
        </Link>
      </div>
    );
  }, [user, dashboardLink, dashboardLabel]);

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
    >
      <div className="glass">
        <div className="container-shell py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-soft">
              <FaBuilding />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight text-slate-900">SyntaxEstate</div>
              <div className="text-[11px] text-slate-500 -mt-0.5">Find, list, approve — smoothly</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/properties" className={navItemClass}>
              Properties
            </NavLink>
          </div>

          <div className="hidden md:block">{rightBlock}</div>

          <button
            className="md:hidden btn-outline px-3"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-b border-slate-200 bg-white"
          >
            <div className="container-shell py-4 space-y-4">
              <NavLink to="/properties" className={navItemClass}>
                Properties
              </NavLink>

              <div className="pt-2 border-t border-slate-200">{rightBlock}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
