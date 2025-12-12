import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';
import AdminDashboard from './AdminDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // If not logged in, kick them out to login page
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null; // Wait for redirect

  // Role-Based Routing
  if (user.role === 'Admin') {
    return <AdminDashboard user={user} />;
  } else if (user.role === 'Seller') {
    return <SellerDashboard user={user} />;
  } else {
    return <BuyerDashboard user={user} />;
  }
}

export default Dashboard;