import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMyProperties, deleteProperty, reset as resetProps } from '../../features/properties/propertySlice';
import {
  getMyInquiries,
  sellerActionOnAppointment,
  reset as resetInq,
} from '../../features/inquiries/inquirySlice';
import {
  FaTrash,
  FaPlus,
  FaEye,
  FaEnvelope,
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaTimes,
  FaEdit,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('listings');

  // seller action UI
  const [editingId, setEditingId] = useState(null);
  const [mode, setMode] = useState(null); // 'propose' | 'accept_requested' | 'reject'
  const [form, setForm] = useState({
    proposedDate: '',
    proposedTime: '',
    proposedPlace: '',
    sellerNote: '',
  });

  const { user } = useSelector((state) => state.auth);
  const { properties = [] } = useSelector((state) => state.properties) || {};
  const { inquiries = [], isError, message } = useSelector((state) => state.inquiries) || {};

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'seller') {
      navigate('/');
      return;
    }

    dispatch(getMyProperties());
    dispatch(getMyInquiries());

    return () => {
      dispatch(resetProps());
      dispatch(resetInq());
    };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this property?')) dispatch(deleteProperty(id));
  };

  const openEditor = (inq, nextMode) => {
    setEditingId(inq._id);
    setMode(nextMode);

    // prefill from requested (backward compatible)
    const reqDate = inq?.appointment?.requestedDate || inq?.appointmentDate || '';
    const reqTime = inq?.appointment?.requestedTime || inq?.appointmentTime || '';
    const reqPlace = inq?.appointment?.requestedPlace || '';

    setForm({
      proposedDate: nextMode === 'propose' ? reqDate : '',
      proposedTime: nextMode === 'propose' ? reqTime : '',
      proposedPlace: reqPlace,
      sellerNote: '',
    });
  };

  const closeEditor = () => {
    setEditingId(null);
    setMode(null);
    setForm({ proposedDate: '', proposedTime: '', proposedPlace: '', sellerNote: '' });
  };

  const submitSellerAction = async (inq) => {
    const payload = { action: mode };

    if (mode === 'propose') {
      if (!form.proposedDate || !form.proposedTime) {
        toast.error('Date & Time required for propose');
        return;
      }
      payload.proposedDate = form.proposedDate;
      payload.proposedTime = form.proposedTime;
      payload.proposedPlace = form.proposedPlace;
      payload.sellerNote = form.sellerNote;
    }

    if (mode === 'accept_requested') {
      // accept requested date/time; optionally set place/note
      payload.proposedPlace = form.proposedPlace;
      payload.sellerNote = form.sellerNote;
    }

    if (mode === 'reject') {
      payload.sellerNote = form.sellerNote || 'Rejected.';
    }

    const res = await dispatch(
      sellerActionOnAppointment({ inquiryId: inq._id, payload })
    );

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(res.payload?.message || 'Updated');
      closeEditor();
    }
  };

  const statusBadge = (status) => {
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
        {s.replace('_', ' ')}
      </span>
    );
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 shadow-sm rounded-xl border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-500">Welcome, {user.name}</p>
        </div>
        <button
          onClick={() => navigate('/add-property')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition shadow"
        >
          <FaPlus /> Add Property
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 mb-6 border-b border-gray-300 pb-1">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-2 font-bold flex items-center gap-2 transition ${
            activeTab === 'listings'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaHome /> My Listings
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`pb-3 px-2 font-bold flex items-center gap-2 transition ${
            activeTab === 'inbox'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaEnvelope /> Inbox
          {inquiries.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {inquiries.length}
            </span>
          )}
        </button>
      </div>

      {/* INBOX */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Messages</h2>

          {inquiries && inquiries.length > 0 ? (
            inquiries.map((msg) => {
              const isAppointment = msg.type === 'appointment';

              const reqDate = msg?.appointment?.requestedDate || msg?.appointmentDate || '';
              const reqTime = msg?.appointment?.requestedTime || msg?.appointmentTime || '';
              const reqPlace = msg?.appointment?.requestedPlace || '';

              const propDate = msg?.appointment?.proposedDate || '';
              const propTime = msg?.appointment?.proposedTime || '';
              const propPlace = msg?.appointment?.proposedPlace || '';
              const sellerNote = msg?.appointment?.sellerNote || '';
              const buyerNote = msg?.appointment?.buyerNote || '';

              const canAct =
                isAppointment && !['buyer_accepted', 'buyer_rejected', 'seller_rejected'].includes(msg.status);

              return (
                <div
                  key={msg._id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-lg text-gray-800">
                        {msg.buyer?.name || 'Guest User'}
                      </span>
                      <span className="block text-xs text-gray-400">{msg.buyer?.email}</span>
                      <div className="mt-2">{isAppointment ? statusBadge(msg.status) : null}</div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Appointment block */}
                  {isAppointment && (
                    <div className="space-y-3 mb-3">
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg flex items-center gap-4">
                        <div className="flex items-center gap-2 font-bold">
                          <FaCalendarAlt /> Requested: {reqDate || '—'}
                        </div>
                        <div className="flex items-center gap-2 font-bold">
                          <FaClock /> {reqTime || '—'}
                        </div>
                        <span className="ml-auto text-xs font-bold uppercase tracking-wider bg-blue-200 px-2 py-1 rounded text-blue-800">
                          Visit Request
                        </span>
                      </div>

                      {reqPlace ? (
                        <div className="text-sm text-gray-700">
                          <span className="font-bold">Buyer preferred place:</span> {reqPlace}
                        </div>
                      ) : null}

                      {msg.status === 'proposed' && (
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm">
                          <div className="font-bold text-gray-800 mb-1">Your Proposal</div>
                          <div>
                            <span className="font-semibold">Date:</span> {propDate || '—'} |{' '}
                            <span className="font-semibold">Time:</span> {propTime || '—'}
                          </div>
                          <div>
                            <span className="font-semibold">Place:</span> {propPlace || '—'}
                          </div>
                          {sellerNote ? (
                            <div className="mt-2">
                              <span className="font-semibold">Note:</span> {sellerNote}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {buyerNote ? (
                        <div className="text-sm text-gray-700">
                          <span className="font-bold">Buyer note:</span> {buyerNote}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 italic mb-3">
                    "{msg.message}"
                  </div>

                  {/* Seller actions */}
                  {isAppointment && canAct && (
                    <div className="mt-3">
                      {editingId !== msg._id ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openEditor(msg, 'accept_requested')}
                            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                          >
                            <FaCheck /> Accept Requested
                          </button>

                          <button
                            onClick={() => openEditor(msg, 'propose')}
                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                          >
                            <FaEdit /> Propose New
                          </button>

                          <button
                            onClick={() => openEditor(msg, 'reject')}
                            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                          >
                            <FaTimes /> Reject
                          </button>

                          {msg.status === 'proposed' && (
                            <span className="text-xs text-gray-500 self-center ml-2">
                              (Waiting for buyer response)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-3 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="font-bold text-gray-800">
                              {mode === 'propose'
                                ? 'Propose New Slot'
                                : mode === 'accept_requested'
                                ? 'Accept Requested Slot'
                                : 'Reject Appointment'}
                            </div>
                            <button onClick={closeEditor} className="text-gray-500 hover:text-gray-700">
                              Cancel
                            </button>
                          </div>

                          {mode === 'propose' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-gray-500">Proposed Date</label>
                                <input
                                  type="date"
                                  className="w-full p-2 border rounded"
                                  value={form.proposedDate}
                                  onChange={(e) => setForm((p) => ({ ...p, proposedDate: e.target.value }))}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-500">Proposed Time</label>
                                <input
                                  type="time"
                                  className="w-full p-2 border rounded"
                                  value={form.proposedTime}
                                  onChange={(e) => setForm((p) => ({ ...p, proposedTime: e.target.value }))}
                                  required
                                />
                              </div>
                            </div>
                          )}

                          {(mode === 'propose' || mode === 'accept_requested') && (
                            <div>
                              <label className="text-xs font-bold text-gray-500">
                                Meeting place (recommended)
                              </label>
                              <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={form.proposedPlace}
                                onChange={(e) => setForm((p) => ({ ...p, proposedPlace: e.target.value }))}
                                placeholder="e.g., Property address / office / nearby landmark"
                              />
                              {mode === 'accept_requested' && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Using requested date/time: <b>{reqDate}</b> at <b>{reqTime}</b>
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-bold text-gray-500">
                              Note {mode === 'reject' ? '(reason)' : '(optional)'}
                            </label>
                            <textarea
                              className="w-full p-2 border rounded"
                              rows="2"
                              value={form.sellerNote}
                              onChange={(e) => setForm((p) => ({ ...p, sellerNote: e.target.value }))}
                            />
                          </div>

                          <button
                            onClick={() => submitSellerAction(msg)}
                            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-black"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <p className="text-sm font-bold text-gray-500 flex items-center gap-1 mt-3">
                    Property: <span className="text-blue-600">{msg.property?.title}</span>
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              No messages found.
            </div>
          )}
        </div>
      )}

      {/* LISTINGS */}
      {activeTab === 'listings' && (
        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Properties</h2>
          {properties.length > 0 ? (
            properties.map((p) => (
              <div
                key={p._id}
                className="flex justify-between items-center border-b border-gray-100 py-4 last:border-0 hover:bg-gray-50 px-2 rounded transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.images?.[0]?.url}
                    alt="property"
                    className="w-16 h-12 rounded object-cover shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{p.title}</p>
                    <p
                      className={`text-xs font-bold uppercase ${
                        p.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {p.status}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/property/${p._id}`)}
                    className="text-gray-400 hover:text-blue-600 transition"
                    title="View"
                  >
                    <FaEye size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No properties listed yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
