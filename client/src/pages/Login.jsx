import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import FormInput from '../components/common/FormInput';
import { FaSignInAlt } from 'react-icons/fa';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      // --- ADD THIS LINE ---
      console.log("LOGIN SUCCESS! User Role is:", user?.role); 
      // --------------------

      if (user?.role === 'seller') {
        navigate('/seller-dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <FaSignInAlt className="text-4xl text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Login to manage your properties</p>
        </div>

        <form onSubmit={onSubmit}>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
          
          <p className="text-sm text-center mt-4">
            <a className="text-blue-600 hover:underline" href="/forgot-password">
              Forgot password?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;