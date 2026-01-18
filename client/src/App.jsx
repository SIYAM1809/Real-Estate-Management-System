import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PAGES
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProperty from './pages/AddProperty';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// DASHBOARDS
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
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
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* BUYER */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['buyer']}>
                  <BuyerDashboard />
                </PrivateRoute>
              }
            />

            {/* SELLER */}
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

            {/* ADMIN */}
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
          </Routes>
        </div>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
