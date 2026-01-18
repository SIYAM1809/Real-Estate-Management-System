import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaUserTie, FaSyncAlt, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_BASE } from '../../utils/apiBase';

// ✅ reviews
import { adminGetReviews, adminUpdateReviewStatus } from '../../features/reviews/reviewSlice';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('properties');

  // properties (your existing code)
  const [adminProperties, setAdminProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [busyPropId, setBusyPropId] = useState(null);

  // ✅ users
  const [usersLoading, setUsersLoading] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [busyUserId, setBusyUserId] = useState(null);

  // ✅ reviews
  const dispatch = useDispatch();
  const { adminReviews = [], isLoading: reviewsLoading } = useSelector((state) => state.reviews) || {};
  const [busyReviewId, setBusyReviewId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchAdminProperties = useCallback(async () => {
    if (!user?.token) return;

    try {
      setLoadingProps(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE}/api/properties/admin-all`, config);
      setAdminProperties(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to load admin properties');
      setAdminProperties([]);
    } finally {
      setLoadingProps(false);
    }
  }, [user]);

  const fetchUsers = useCallback(async () => {
    if (!user?.token) return;

    try {
      setUsersLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE}/api/admin/users`, config);

      setBuyers(Array.isArray(res.data?.buyers) ? res.data.buyers : []);
      setSellers(Array.isArray(res.data?.sellers) ? res.data.sellers : []);
      setAdmins(Array.isArray(res.data?.admins) ? res.data.admins : []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to load users');
      setBuyers([]);
      setSellers([]);
      setAdmins([]);
    } finally {
      setUsersLoading(false);
    }
  }, [user]);

  const fetchReviews = useCallback(() => {
    if (!user?.token) return;
    dispatch(adminGetReviews()); // ✅ no guessing about params
  }, [dispatch, user]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchAdminProperties();
    fetchUsers();
    fetchReviews();
  }, [user, navigate, fetchAdminProperties, fetchUsers, fetchReviews]);

  const handleStatusChange = async (id, newStatus) => {
    if (!user?.token) return toast.error('Login again');
    if (!id) return;

    try {
      setBusyPropId(id);

      // optimistic UI
      setAdminProperties((prev) =>
        prev.map((prop) => (prop._id === id ? { ...prop, status: newStatus } : prop))
      );

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_BASE}/api/properties/${id}/status`, { status: newStatus }, config);

      toast.success(`Property ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to update status');
      fetchAdminProperties();
    } finally {
      setBusyPropId(null);
    }
  };

  const deleteUser = async (id) => {
    if (!user?.token) return toast.error('Login again');

    try {
      setBusyUserId(id);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      await axios.delete(`${API_BASE}/api/admin/users/${id}`, config);

      // optimistic removal
      setBuyers((prev) => prev.filter((x) => x._id !== id));
      setSellers((prev) => prev.filter((x) => x._id !== id));

      toast.success('User deleted');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to delete user');
      fetchUsers();
    } finally {
      setBusyUserId(null);
    }
  };

  const updateReviewStatus = async (id, status) => {
    setBusyReviewId(id);
    const res = await dispatch(adminUpdateReviewStatus({ id, status }));
    setBusyReviewId(null);

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(`Review ${status}`);
      // UI auto-hides because we filter pending below
    } else {
      toast.error(res.payload || 'Failed');
      fetchReviews();
    }
  };

  const pendingReviews = Array.isArray(adminReviews)
    ? adminReviews.filter((r) => String(r.status || '').toLowerCase() === 'pending')
    : [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserTie /> Admin Control Panel
        </h1>

        <button
          onClick={() => {
            fetchAdminProperties();
            fetchUsers();
            fetchReviews();
          }}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
          disabled={loadingProps || usersLoading || reviewsLoading}
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab('properties')}
          className={`font-bold px-3 py-2 rounded ${
            activeTab === 'properties' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Properties
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`font-bold px-3 py-2 rounded flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <FaUsers /> Users
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`font-bold px-3 py-2 rounded ${
            activeTab === 'reviews' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Reviews
        </button>
      </div>

      {/* PROPERTIES */}
      {activeTab === 'properties' && (
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
              {adminProperties.map((property) => {
                const isPending = property.status === 'pending';
                const isBusy = busyPropId === property._id;

                return (
                  <tr key={property._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 font-bold">{property.title}</td>
                    <td className="py-3 px-6">{property.seller?.name || 'Unknown'}</td>

                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold 
                          ${
                            property.status === 'approved'
                              ? 'bg-green-200 text-green-800'
                              : property.status === 'rejected'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}
                      >
                        {String(property.status || '').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-6 text-center">
                      {isPending ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleStatusChange(property._id, 'approved')}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-60"
                            title="Approve"
                            disabled={isBusy}
                          >
                            <FaCheck />
                          </button>

                          <button
                            onClick={() => handleStatusChange(property._id, 'rejected')}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-60"
                            title="Reject"
                            disabled={isBusy}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {adminProperties.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buyers */}
          <div className="bg-white rounded-lg shadow p-4 border">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Buyers</h2>

            {buyers.length === 0 ? (
              <div className="text-gray-500">No buyers found.</div>
            ) : (
              <div className="space-y-2">
                {buyers.map((u) => (
                  <div key={u._id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <div>
                      <div className="font-bold text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    <button
                      onClick={() => deleteUser(u._id)}
                      disabled={busyUserId === u._id}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sellers */}
          <div className="bg-white rounded-lg shadow p-4 border">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Sellers</h2>

            {sellers.length === 0 ? (
              <div className="text-gray-500">No sellers found.</div>
            ) : (
              <div className="space-y-2">
                {sellers.map((u) => (
                  <div key={u._id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <div>
                      <div className="font-bold text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    <button
                      onClick={() => deleteUser(u._id)}
                      disabled={busyUserId === u._id}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admins (display only) */}
          <div className="bg-white rounded-lg shadow p-4 border lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Admins</h2>
            {admins.length === 0 ? (
              <div className="text-gray-500">No admins found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {admins.map((u) => (
                  <div key={u._id} className="bg-gray-50 p-3 rounded border">
                    <div className="font-bold text-gray-800">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-lg shadow p-4 border">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Pending Reviews</h2>

          {pendingReviews.length === 0 ? (
            <div className="text-gray-500">No pending reviews.</div>
          ) : (
            <div className="space-y-3">
              {pendingReviews.map((r) => (
                <div key={r._id} className="bg-gray-50 p-4 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-800">
                        {r.property?.title || 'Property'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Buyer: {r.buyer?.name || 'Buyer'} | Rating: {r.rating}
                      </div>
                      {r.comment ? (
                        <div className="text-sm text-gray-700 mt-2 italic">"{r.comment}"</div>
                      ) : null}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateReviewStatus(r._id, 'approved')}
                        disabled={busyReviewId === r._id}
                        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-60"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => updateReviewStatus(r._id, 'rejected')}
                        disabled={busyReviewId === r._id}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-60"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
