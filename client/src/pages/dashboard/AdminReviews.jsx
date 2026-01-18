import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  adminGetReviews,
  adminUpdateReviewStatus,
  adminDeleteReview,
} from '../../features/reviews/reviewSlice';
import { FaCheck, FaTimes, FaTrash, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AdminReviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { adminReviews = [] } = useSelector((state) => state.reviews);

  const [status, setStatus] = useState('pending');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    dispatch(adminGetReviews({ status }));
  }, [user, status, dispatch, navigate]);

  const isPendingView = useMemo(() => status === 'pending', [status]);

  const refresh = () => dispatch(adminGetReviews({ status }));

  const setStatusOf = async (id, newStatus) => {
    try {
      setBusyId(id);
      await dispatch(adminUpdateReviewStatus({ id, status: newStatus })).unwrap();
      toast.success(`Review ${newStatus}`);

      // ✅ remove from pending list immediately
      if (isPendingView) {
        refresh();
      }
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to update review');
    } finally {
      setBusyId(null);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this review?')) return;

    try {
      setBusyId(id);
      await dispatch(adminDeleteReview(id)).unwrap();
      toast.success('Review deleted');
      refresh();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to delete review');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin: Reviews Moderation</h1>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={refresh}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white uppercase text-sm">
              <th className="py-3 px-6">Property</th>
              <th className="py-3 px-6">Buyer</th>
              <th className="py-3 px-6">Rating</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm">
            {adminReviews.map((r) => {
              const isBusy = busyId === r._id;
              const showApproveReject = r.status === 'pending';

              return (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-bold">{r.property?.title || 'N/A'}</td>
                  <td className="py-3 px-6">
                    {r.buyer?.name} ({r.buyer?.email})
                  </td>
                  <td className="py-3 px-6">{r.rating}</td>
                  <td className="py-3 px-6 font-bold">{String(r.status).toUpperCase()}</td>

                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      {/* ✅ Only show approve/reject when pending */}
                      {showApproveReject ? (
                        <>
                          <button
                            onClick={() => setStatusOf(r._id, 'approved')}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-60"
                            title="Approve"
                            disabled={isBusy}
                          >
                            <FaCheck />
                          </button>

                          <button
                            onClick={() => setStatusOf(r._id, 'rejected')}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-60"
                            title="Reject"
                            disabled={isBusy}
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 self-center">No actions</span>
                      )}

                      {/* Delete can remain always if you want */}
                      <button
                        onClick={() => del(r._id)}
                        className="bg-gray-700 text-white p-2 rounded hover:bg-black disabled:opacity-60"
                        title="Delete"
                        disabled={isBusy}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {adminReviews.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No reviews found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
