import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaUserTie } from 'react-icons/fa';

function AdminDashboard() {
  const [adminProperties, setAdminProperties] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // We use local axios calls here for simplicity instead of Redux
  // because this is a specialized admin-only page
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Kick out non-admins
      return;
    }

    const fetchAdminData = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/properties/admin-all', config);
      setAdminProperties(res.data);
    };

    fetchAdminData();
  }, [user, navigate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/properties/${id}/status`, { status: newStatus }, config);
      
      // Refresh the list locally to show change instantly
      setAdminProperties((prev) =>
        prev.map((prop) => (prop._id === id ? { ...prop, status: newStatus } : prop))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaUserTie /> Admin Control Panel
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white uppercase text-sm">
              <th className="py-3 px-6">Property</th>
              <th className="py-3 px-6">Seller</th>
              <th className="py-3 px-6">Current Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {adminProperties.map((property) => (
              <tr key={property._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 font-bold">{property.title}</td>
                <td className="py-3 px-6">{property.seller?.name || 'Unknown'}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${property.status === 'approved' ? 'bg-green-200 text-green-800' : 
                      property.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {property.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  <button 
                    onClick={() => handleStatusChange(property._id, 'approved')}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600" title="Approve">
                    <FaCheck />
                  </button>
                  <button 
                    onClick={() => handleStatusChange(property._id, 'rejected')}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600" title="Reject">
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;