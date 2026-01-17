import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FaSignOutAlt, FaUser, FaBuilding } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const dashboardLink =
    user?.role === 'admin'
      ? '/admin-dashboard'
      : user?.role === 'seller'
      ? '/seller-dashboard'
      : '/dashboard';

  const dashboardLabel =
    user?.role === 'admin' ? 'Admin Panel' : user?.role === 'seller' ? 'Seller Panel' : 'Dashboard';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <FaBuilding /> SyntaxEstate
        </Link>

        <ul className="flex items-center gap-6 font-medium text-gray-600">
          <li>
            <Link to="/properties" className="hover:text-blue-600 transition">
              Properties
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <span className="text-sm text-gray-400 mr-2">Hello, {user.name}</span>
                <Link
                  to={dashboardLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {dashboardLabel}
                </Link>
              </li>
              <li>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-600 transition flex items-center gap-1">
                  <FaUser /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
