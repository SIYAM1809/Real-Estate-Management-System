// client/src/pages/Register.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-grid-pattern relative overflow-hidden py-10">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl relative z-10 mx-4"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm transform rotate-3">
            <FaUserPlus className="text-3xl text-secondary-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="mt-2 text-slate-500">Join our community today</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative group">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe"
                className="input pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="john@example.com"
                className="input pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
                className="input pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                className="input pl-11"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="label">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${role === 'buyer' ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm ring-1 ring-primary-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="role" value="buyer" checked={role === 'buyer'} onChange={onChange} className="sr-only" />
                <span className="font-bold text-sm">Buyer</span>
                <span className="text-[10px] opacity-70">Hunting property</span>
              </label>
              <label className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${role === 'seller' ? 'bg-secondary-50 border-secondary-500 text-secondary-700 shadow-sm ring-1 ring-secondary-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="role" value="seller" checked={role === 'seller'} onChange={onChange} className="sr-only" />
                <span className="font-bold text-sm">Seller</span>
                <span className="text-[10px] opacity-70">Listing property</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 mt-4 text-lg shadow-lg shadow-primary-500/25"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>

          <div className="w-full h-px bg-slate-200 mt-6" />

          <p className="text-sm text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
