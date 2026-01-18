import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PAGES
import AddProperty from './pages/AddProperty';
import Properties from './pages/Properties';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminReviews from './pages/dashboard/AdminReviews';


// COMPONENTS
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-white font-sans text-gray-900">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PUBLIC */}
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


            {/* BUYER DASHBOARD (Protected) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['buyer']}>
                  <BuyerDashboard />
                </PrivateRoute>
              }
            />

            {/* SELLER (Protected) */}
            <Route
              path="/seller-dashboard"
              element={
                <PrivateRoute allowedRoles={['seller']}>
                  <SellerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-property"
              element={
                <PrivateRoute allowedRoles={['seller']}>
                  <AddProperty />
                </PrivateRoute>
              }
            />

            <Route
  path="/dashboard"
  element={
    <PrivateRoute allowedRoles={['buyer']}>
      <BuyerDashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/seller-dashboard"
  element={
    <PrivateRoute allowedRoles={['seller']}>
      <SellerDashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/admin-dashboard"
  element={
    <PrivateRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/admin-reviews"
  element={
    <PrivateRoute allowedRoles={['admin']}>
      <AdminReviews />
    </PrivateRoute>
  }
/>

            {/* ADMIN (Protected) */}
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
