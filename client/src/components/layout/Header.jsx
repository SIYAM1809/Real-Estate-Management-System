import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { FaSignInAlt, FaUser, FaBuilding, FaSignOutAlt } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user state from Redux
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <FaBuilding /> 
          <span>SyntaxEstate</span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
            </li>
            <li>
              <Link to="/properties" className="text-gray-600 hover:text-blue-600 font-medium transition">Properties</Link>
            </li>

            {user ? (
              // SHOW THIS IF LOGGED IN
              <>
                <li className="text-gray-600 font-medium">
                  Hello, <span className="font-bold text-blue-600">{user.name}</span>
                </li>
                <li>
                  <button 
                    onClick={onLogout} 
                    className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              // SHOW THIS IF LOGGED OUT
              <>
                <li>
                  <Link to="/login" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition">
                    <FaSignInAlt /> Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <FaUser /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;