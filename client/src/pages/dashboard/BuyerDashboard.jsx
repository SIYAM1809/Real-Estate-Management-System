import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites } from '../../features/favorites/favoriteSlice';
import {
  getMySentInquiries,
  buyerRespondToAppointment,
} from '../../features/inquiries/inquirySlice';
import PropertyItem from '../../components/properties/PropertyItem';
import { toast } from 'react-toastify';
import { FaSyncAlt } from 'react-icons/fa';

function BuyerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { favorites = [] } = useSelector((state) => state.favorites) || {};
  const { sentInquiries = [] } = useSelector((state) => state.inquiries) || {};

  const isBuyer = user?.role === 'buyer';

  const refreshAll = useCallback(() => {
    if (!isBuyer) return;
    dispatch(getFavorites());
    dispatch(getMySentInquiries());
  }, [dispatch, isBuyer]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ✅ polling appointments (real-time-ish)
  useEffect(() => {
    if (!isBuyer) return;
    const t = setInterval(() => dispatch(getMySentInquiries()), 15000);
    return () => clearInterval(t);
  }, [dispatch, isBuyer]);

  const respond = async (inqId, action) => {
    const res = await dispatch(
      buyerRespondToAppointment({
        inquiryId: inqId,
        payload: { action }, // 'accept' | 'reject'
      })
    );

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(res.payload?.message || 'Updated');
    } else {
      toast.error(res.payload || 'Failed');
    }
  };

  const badge = (status) => {
    const s = status || 'pending';
    const cls =
      s === 'buyer_accepted'
        ? 'bg-green-200 text-green-800'
        : s === 'buyer_rejected' || s === 'seller_rejected'
        ? 'bg-red-200 text-red-800'
        : s === 'proposed'
        ? 'bg-blue-200 text-blue-800'
        : 'bg-yellow-200 text-yellow-800';

    return (
      <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${cls}`}>
        {s.replaceAll('_', ' ')}
      </span>
    );
  };

  const appointmentOnly = sentInquiries.filter((x) => x.type === 'appointment');

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Buyer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>

        <button
          onClick={refreshAll}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {/* FAVORITES */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <span className="text-2xl">❤️</span>
          <h2 className="text-xl font-bold text-gray-800">My Favorite Homes</h2>
        </div>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav) => (fav && fav._id ? <PropertyItem key={fav._id} property={fav} /> : null))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-2">You haven't liked any properties yet.</p>
            <p className="text-sm text-gray-400">Browse homes and click the heart icon to save them here.</p>
          </div>
        )}
      </div>

      {/* APPOINTMENTS */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <span className="text-2xl">📅</span>
          <h2 className="text-xl font-bold text-gray-800">My Appointment Requests</h2>
        </div>

        {appointmentOnly.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-2">No appointment requests yet.</p>
            <p className="text-sm text-gray-400">Request a visit from any property details page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointmentOnly.map((inq) => {
              const reqDate = inq?.appointment?.requestedDate || inq?.appointmentDate || '';
              const reqTime = inq?.appointment?.requestedTime || inq?.appointmentTime || '';
              const reqPlace = inq?.appointment?.requestedPlace || '';

              const propDate = inq?.appointment?.proposedDate || '';
              const propTime = inq?.appointment?.proposedTime || '';
              const propPlace = inq?.appointment?.proposedPlace || '';
              const sellerNote = inq?.appointment?.sellerNote || '';

              return (
                <div key={inq._id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-800">{inq.property?.title}</div>
                      <div className="text-sm text-gray-600">
                        Seller: <span className="font-semibold">{inq.seller?.name}</span>
                      </div>
                      <div className="mt-2">{badge(inq.status)}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div>
                      <span className="font-semibold">Requested:</span> {reqDate} {reqTime}
                    </div>
                    {reqPlace ? (
                      <div>
                        <span className="font-semibold">Preferred place:</span> {reqPlace}
                      </div>
                    ) : null}
                  </div>

                  {inq.status === 'pending' && (
                    <div className="mt-3 text-sm text-gray-600 font-semibold">
                      Waiting for seller response…
                    </div>
                  )}

                  {inq.status === 'proposed' && (
                    <div className="mt-3 bg-white border rounded p-3">
                      <div className="font-bold text-gray-800 mb-1">Seller Proposal</div>
                      <div className="text-sm">
                        <div>
                          <span className="font-semibold">Date:</span> {propDate || '—'} |{' '}
                          <span className="font-semibold">Time:</span> {propTime || '—'}
                        </div>
                        <div>
                          <span className="font-semibold">Place:</span> {propPlace || '—'}
                        </div>
                        {sellerNote ? (
                          <div className="mt-2">
                            <span className="font-semibold">Message from seller:</span> {sellerNote}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => respond(inq._id, 'accept')}
                          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respond(inq._id, 'reject')}
                          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {inq.status === 'buyer_accepted' && (
                    <div className="mt-3 text-green-700 font-bold">
                      ✅ Confirmed.
                      <div className="text-sm font-semibold text-green-800 mt-1">
                        Date: {propDate || reqDate || '—'} | Time: {propTime || reqTime || '—'}
                      </div>
                      <div className="text-sm font-semibold text-green-800">
                        Place: {propPlace || '—'}
                      </div>
                      {sellerNote ? (
                        <div className="text-sm font-semibold text-green-800 mt-1">
                          Seller message: {sellerNote}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {inq.status === 'seller_rejected' && (
                    <div className="mt-3 text-red-700 font-bold">
                      ❌ Seller rejected your request.
                      {sellerNote ? (
                        <div className="text-sm font-semibold text-red-800 mt-1">
                          Reason: {sellerNote}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {inq.status === 'buyer_rejected' && (
                    <div className="mt-3 text-red-700 font-bold">
                      ❌ You rejected the seller proposal.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerDashboard;
