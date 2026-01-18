import { useEffect, useState, useCallback } from 'react';
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
  FaSyncAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('listings');

  // seller action UI
  const [editingId, setEditingId] = useState(null);
  const [mode, setMode] = useState(null); // 'propose' | 'accept_requested' | 'reject'
  const [busyInquiryId, setBusyInquiryId] = useState(null);

  const [form, setForm] = useState({
    proposedDate: '',
    proposedTime: '',
    proposedPlace: '',
    sellerNote: '',
  });

  const { user } = useSelector((state) => state.auth);
  const { properties = [] } = useSelector((state) => state.properties) || {};
  const { inquiries = [], isError, message } = useSelector((state) => state.inquiries) || {};

  const refreshAll = useCallback(() => {
    dispatch(getMyProperties());
    dispatch(getMyInquiries());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'seller') {
      navigate('/');
      return;
    }

    refreshAll();

    return () => {
      dispatch(resetProps());
      dispatch(resetInq());
    };
  }, [user, navigate, dispatch, refreshAll]);

  // ✅ polling only on Inbox tab (real-time-ish without crashing SPA)
  useEffect(() => {
    if (activeTab !== 'inbox') return;
    const t = setInterval(() => {
      dispatch(getMyInquiries());
    }, 15000);
    return () => clearInterval(t);
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this property?')) dispatch(deleteProperty(id));
  };

  const openEditor = (inq, nextMode) => {
    setEditingId(inq._id);
    setMode(nextMode);

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
    if (!mode) return;

    // ✅ Strict rules based on your requirements:
    // - reject MUST have reason
    // - accept/propose can include note
    if (mode === 'reject' && !String(form.sellerNote || '').trim()) {
      toast.error('Rejection reason is required.');
      return;
    }

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
      payload.proposedPlace = form.proposedPlace;
      payload.sellerNote = form.sellerNote;
    }

    if (mode === 'reject') {
      payload.sellerNote = String(form.sellerNote).trim();
    }

    setBusyInquiryId(inq._id);
    const res = await dispatch(sellerActionOnAppointment({ inquiryId: inq._id, payload }));
    setBusyInquiryId(null);

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(res.payload?.message || 'Updated');
      closeEditor();
    } else {
      toast.error(res.payload || 'Action failed');
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
        {s.replaceAll('_', ' ')}
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

        <div className="flex gap-2">
          <button
            onClick={refreshAll}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow"
          >
            <FaSyncAlt /> Refresh
          </button>

          <button
            onClick={() => navigate('/add-property')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition shadow"
          >
            <FaPlus /> Add Property
          </button>
        </div>
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Requests</h2>

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

              // ✅ Seller can act ONLY when status is pending
              const canAct = isAppointment && msg.status === 'pending';
              const isBusy = busyInquiryId === msg._id;

              return (
                <div
                  key={msg._id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                >
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
                          <div className="font-bold text-gray-800 mb-1">Your Proposal (Waiting for buyer)</div>
                          <div>
                            <span className="font-semibold">Date:</span> {propDate || '—'} |{' '}
                            <span className="font-semibold">Time:</span> {propTime || '—'}
                          </div>
                          <div>
                            <span className="font-semibold">Place:</span> {propPlace || '—'}
                          </div>
                          {sellerNote ? (
                            <div className="mt-2">
                              <span className="font-semibold">Note sent to buyer:</span> {sellerNote}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {msg.status === 'buyer_accepted' && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm text-green-800">
                          <div className="font-bold mb-1">✅ Buyer confirmed</div>
                          <div>
                            <span className="font-semibold">Date:</span> {propDate || reqDate || '—'} |{' '}
                            <span className="font-semibold">Time:</span> {propTime || reqTime || '—'}
                          </div>
                          <div>
                            <span className="font-semibold">Place:</span> {propPlace || '—'}
                          </div>
                          {buyerNote ? (
                            <div className="mt-2">
                              <span className="font-semibold">Buyer note:</span> {buyerNote}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {msg.status === 'buyer_rejected' && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-800">
                          <div className="font-bold mb-1">❌ Buyer rejected your proposal</div>
                          {buyerNote ? (
                            <div>
                              <span className="font-semibold">Buyer note:</span> {buyerNote}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {msg.status === 'seller_rejected' && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-800">
                          <div className="font-bold mb-1">❌ You rejected this request</div>
                          <div>
                            <span className="font-semibold">Reason sent to buyer:</span> {sellerNote || '—'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 italic mb-3">
                    "{msg.message}"
                  </div>

                  {/* ✅ Seller actions ONLY on pending */}
                  {isAppointment && canAct && (
                    <div className="mt-3">
                      {editingId !== msg._id ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openEditor(msg, 'accept_requested')}
                            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-2 disabled:opacity-60"
                            disabled={isBusy}
                          >
                            <FaCheck /> Accept Requested
                          </button>

                          <button
                            onClick={() => openEditor(msg, 'propose')}
                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
                            disabled={isBusy}
                          >
                            <FaEdit /> Propose New
                          </button>

                          <button
                            onClick={() => openEditor(msg, 'reject')}
                            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
                            disabled={isBusy}
                          >
                            <FaTimes /> Reject
                          </button>
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
                              <label className="text-xs font-bold text-gray-500">Meeting place</label>
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
                              Note {mode === 'reject' ? '(reason required)' : '(optional)'}
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
                            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-black disabled:opacity-60"
                            disabled={isBusy}
                          >
                            {isBusy ? 'Submitting...' : 'Submit'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isAppointment && msg.status === 'proposed' && (
                    <div className="text-xs text-gray-500 mt-3">
                      Waiting for buyer response…
                    </div>
                  )}

                  <p className="text-sm font-bold text-gray-500 flex items-center gap-1 mt-3">
                    Property: <span className="text-blue-600">{msg.property?.title}</span>
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              No requests found.
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
