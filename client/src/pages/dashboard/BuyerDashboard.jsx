import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFavorites } from '../../features/favorites/favoriteSlice';
import { getMyRequests } from '../../features/inquiries/inquirySlice';
import PropertyItem from '../../components/properties/PropertyItem';

function BuyerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('favorites');

  const { user } = useSelector((state) => state.auth);
  const { favorites = [] } = useSelector((state) => state.favorites) || {};
  const { requests = [] } = useSelector((state) => state.inquiries) || {};

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'buyer') navigate('/dashboard');
    else {
      dispatch(getFavorites());
      dispatch(getMyRequests());
    }
  }, [dispatch, user, navigate]);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Buyer Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setTab('favorites')}
          className={`font-bold px-2 pb-2 ${tab === 'favorites' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}
        >
          ❤️ Favorites
        </button>
        <button
          onClick={() => setTab('requests')}
          className={`font-bold px-2 pb-2 ${tab === 'requests' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}
        >
          📅 My Requests
        </button>
      </div>

      {tab === 'favorites' && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-6">My Favorite Homes</h2>

          {favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((fav) => (fav && fav._id ? <PropertyItem key={fav._id} property={fav} /> : null))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg mb-2">You haven't liked any properties yet.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-6">My Appointment Requests</h2>

          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((r) => {
                const requestedDate = r.appointment?.requestedDate || r.appointmentDate;
                const requestedTime = r.appointment?.requestedTime || r.appointmentTime;
                const scheduledDate = r.appointment?.scheduledDate;
                const scheduledTime = r.appointment?.scheduledTime;
                const meetingPlace = r.appointment?.meetingPlace;
                const status = r.status || (r.type === 'appointment' ? 'pending' : 'new');

                return (
                  <div key={r._id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-gray-800">{r.property?.title || 'Property'}</div>
                        <div className="text-sm text-gray-500">Seller: {r.seller?.name || 'Unknown'}</div>
                      </div>
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {status.replaceAll('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2 text-sm">
                      <div><span className="font-bold">Your preference:</span> {requestedDate || '—'} {requestedTime || ''}</div>
                      {scheduledDate && scheduledTime ? (
                        <div className="mt-2 p-2 bg-white border rounded">
                          <div className="font-bold">Scheduled:</div>
                          <div>{scheduledDate} at {scheduledTime}</div>
                          {meetingPlace && <div className="text-gray-600">Place: {meetingPlace}</div>}
                        </div>
                      ) : (
                        <div className="text-gray-500 mt-2">Waiting for seller response…</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500">No requests yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
