// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import Properties from './pages/Properties';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';

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
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Buyer Dashboard (Protected) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['buyer']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Seller-only */}
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

            {/* Admin-only */}
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Optional: keep old /admin route but force it to admin dashboard */}
            <Route
              path="/admin"
              element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>}
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
