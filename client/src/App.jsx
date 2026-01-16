import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PAGES
// --- FIX: Import the REAL dashboard file ---
import Dashboard from './pages/Dashboard'; 
// -------------------------------------------
import AddProperty from './pages/AddProperty';
import Properties from './pages/Properties';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// COMPONENTS
import Navbar from './components/Navbar'; 

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
            
            {/* The Route URL stays "/dashboard", but now it loads the correct file */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;