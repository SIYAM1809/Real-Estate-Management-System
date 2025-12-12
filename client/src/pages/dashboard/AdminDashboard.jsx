import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPending, approveProperty, rejectProperty } from '../../features/admin/adminSlice';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { pendingProperties, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getPending());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveProperty(id));
    toast.success('Property Approved!');
  };

  const handleReject = (id) => {
    if(window.confirm('Are you sure you want to reject this listing?')) {
      dispatch(rejectProperty(id));
      toast.error('Property Rejected.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center mt-20"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-700">Pending Approvals ({pendingProperties.length})</h2>
        </div>

        {pendingProperties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending properties found. Good job!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img 
                        src={property.images[0]?.url || 'https://via.placeholder.com/100'} 
                        alt={property.title} 
                        className="w-20 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-4 font-medium">{property.title}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {property.seller?.name}<br/>
                      <span className="text-xs">{property.seller?.email}</span>
                    </td>
                    <td className="p-4">${property.price.toLocaleString()}</td>
                    <td className="p-4 text-center space-x-2">
                      <button 
                        onClick={() => handleApprove(property._id)}
                        className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200 transition"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => handleReject(property._id)}
                        className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 transition"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;