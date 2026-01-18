import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminGetReviews, adminUpdateReviewStatus, adminDeleteReview } from '../../features/reviews/reviewSlice';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

export default function AdminReviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { adminReviews = [] } = useSelector((state) => state.reviews);

  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    dispatch(adminGetReviews({ status }));
  }, [user, status, dispatch, navigate]);

  const setStatusOf = (id, newStatus) => {
    dispatch(adminUpdateReviewStatus({ id, status: newStatus }));
  };

  const del = (id) => {
    if (window.confirm('Delete this review?')) dispatch(adminDeleteReview(id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin: Reviews Moderation</h1>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
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
            {adminReviews.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 font-bold">{r.property?.title || 'N/A'}</td>
                <td className="py-3 px-6">{r.buyer?.name} ({r.buyer?.email})</td>
                <td className="py-3 px-6">{r.rating}</td>
                <td className="py-3 px-6 font-bold">{r.status.toUpperCase()}</td>
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  <button
                    onClick={() => setStatusOf(r._id, 'approved')}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    title="Approve"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => setStatusOf(r._id, 'rejected')}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    title="Reject"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => del(r._id)}
                    className="bg-gray-700 text-white p-2 rounded hover:bg-black"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

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
