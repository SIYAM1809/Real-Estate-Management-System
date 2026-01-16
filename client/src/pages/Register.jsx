// client/src/pages/Register.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import FormInput from '../components/common/FormInput';
import { FaUserPlus } from 'react-icons/fa';

function Register() {
  const [didSubmit, setDidSubmit] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer', // ✅ keep lowercase to match backend enum
  });

  const { name, email, password, confirmPassword, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);

    // ✅ If registration succeeded because *we submitted*
    if (isSuccess && didSubmit) {
      toast.success('Registration successful ✅');

      // redirect based on role (since your backend returns role lowercase)
      if (user?.role === 'seller') navigate('/seller-dashboard');
      else if (user?.role === 'admin') navigate('/admin-dashboard');
      else navigate('/dashboard');
    }

    // ✅ If user is already logged in and they just opened register page
    if (user && !didSubmit) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch, didSubmit]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setDidSubmit(true);

    dispatch(
      register({
        name,
        email,
        password,
        role,
      })
    );
  };

  if (isLoading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <FaUserPlus className="text-4xl text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Join SyntaxEstate today</p>
        </div>

        <form onSubmit={onSubmit}>
          <FormInput
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="John Doe"
          />
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="john@example.com"
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="********"
          />
          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            placeholder="********"
          />

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              I am a:
            </label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="buyer">Buyer (Looking for property)</option>
              <option value="seller">Seller (Listing property)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
