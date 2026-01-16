import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SellerDashboard from './dashboard/SellerDashboard';
import BuyerDashboard from './dashboard/BuyerDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // 1. If Admin -> Admin Dashboard
  if (user.role === 'admin') {
     return <AdminDashboard />;
  }

  // 2. If Seller -> Seller Dashboard
  if (user.role === 'seller') {
     return <SellerDashboard />;
  }

  // 3. Everyone else -> Buyer Dashboard
  return <BuyerDashboard />;
}

export default Dashboard;