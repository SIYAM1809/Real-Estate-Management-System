import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMyProperties, deleteProperty, reset } from '../../features/properties/propertySlice';
import { getMyInquiries, respondToAppointment } from '../../features/inquiries/inquirySlice';
import { FaTrash, FaPlus, FaEye, FaEnvelope, FaHome, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('listings');
  const [activeResponse, setActiveResponse] = useState(null); // { id, action }
  const [respForm, setRespForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    meetingPlace: '',
    sellerNote: '',
  });

  const { user } = useSelector((state) => state.auth);
  // Ensure we have defaults if state is empty
  const { properties = [], isLoading } = useSelector((state) => state.properties) || {};
  const { inquiries = [] } = useSelector((state) => state.inquiries) || {};

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'seller') {
      navigate('/dashboard');
    } else {
      dispatch(getMyProperties());
      dispatch(getMyInquiries());
    }
    return () => { dispatch(reset()); };
  }, [user, navigate, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this property?')) dispatch(deleteProperty(id));
  };

  const openResponse = (msg, action) => {
    setActiveResponse({ id: msg._id, action });

    // prefill if already exists
    const ap = msg.appointment || {};
    setRespForm({
      scheduledDate: ap.scheduledDate || '',
      scheduledTime: ap.scheduledTime || '',
      meetingPlace: ap.meetingPlace || '',
      sellerNote: ap.sellerNote || '',
    });
  };

  const submitResponse = async () => {
    if (!activeResponse) return;

    const { action, id } = activeResponse;

    const payload =
      action === 'reject'
        ? { action, sellerNote: respForm.sellerNote }
        : {
            action,
            scheduledDate: respForm.scheduledDate,
            scheduledTime: respForm.scheduledTime,
            meetingPlace: respForm.meetingPlace,
            sellerNote: respForm.sellerNote,
          };

    try {
      await dispatch(respondToAppointment({ inquiryId: id, payload })).unwrap();
      toast.success(`Appointment ${action} ✅`);
      setActiveResponse(null);
    } catch (err) {
      toast.error(String(err));
    }
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
        <button onClick={() => navigate('/add-property')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition shadow">
          <FaPlus /> Add Property
        </button>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-6 mb-6 border-b border-gray-300 pb-1">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-2 font-bold flex items-center gap-2 transition ${activeTab === 'listings' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FaHome /> My Listings
        </button>
        <button 
          onClick={() => setActiveTab('inbox')}
          className={`pb-3 px-2 font-bold flex items-center gap-2 transition ${activeTab === 'inbox' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FaEnvelope /> Inbox 
          {inquiries.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{inquiries.length}</span>}
        </button>
      </div>

      {/* --- INBOX CONTENT --- */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Messages</h2>
          {inquiries && inquiries.length > 0 ? (
            inquiries.map((msg) => {
              // Extract data with backward compatibility
              const requestedDate = msg.appointment?.requestedDate || msg.appointmentDate;
              const requestedTime = msg.appointment?.requestedTime || msg.appointmentTime;
              const scheduledDate = msg.appointment?.scheduledDate;
              const scheduledTime = msg.appointment?.scheduledTime;
              const meetingPlace = msg.appointment?.meetingPlace;
              const status = msg.status || (msg.type === 'appointment' ? 'pending' : 'new');

              return (
                <div key={msg._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  
                  {/* Header: Sender Name & Date */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold text-lg text-gray-800">{msg.buyer?.name || 'Guest User'}</span>
                      <span className="block text-xs text-gray-400">{msg.buyer?.email}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* VISUAL BADGE FOR APPOINTMENT */}
                  {msg.type === 'appointment' && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider bg-blue-200 px-2 py-1 rounded">
                          {status.replaceAll('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">Appointment</span>
                      </div>

                      {/* Buyer preference */}
                      <div className="flex items-center gap-4 font-bold">
                        <FaCalendarAlt /> {requestedDate || 'No preferred date'}
                        <FaClock /> {requestedTime || 'No preferred time'}
                      </div>

                      {/* Seller schedule (if exists) */}
                      {scheduledDate && scheduledTime && (
                        <div className="bg-white border border-blue-100 p-2 rounded text-sm">
                          <div className="font-bold">Scheduled:</div>
                          <div>{scheduledDate} at {scheduledTime}</div>
                          {meetingPlace && <div className="text-gray-600">Place: {meetingPlace}</div>}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => openResponse(msg, 'propose')}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Propose
                        </button>
                        <button
                          onClick={() => openResponse(msg, 'confirm')}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => openResponse(msg, 'reject')}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </div>

                      {/* Response form */}
                      {activeResponse?.id === msg._id && (
                        <div className="bg-white border border-blue-100 p-3 rounded space-y-2">
                          <div className="text-sm font-bold">
                            Action: {activeResponse.action.toUpperCase()}
                          </div>

                          {activeResponse.action !== 'reject' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-gray-500">Date</label>
                                <input
                                  type="date"
                                  className="w-full p-2 border rounded"
                                  value={respForm.scheduledDate}
                                  onChange={(e) => setRespForm((p) => ({ ...p, scheduledDate: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-500">Time</label>
                                <input
                                  type="time"
                                  className="w-full p-2 border rounded"
                                  value={respForm.scheduledTime}
                                  onChange={(e) => setRespForm((p) => ({ ...p, scheduledTime: e.target.value }))}
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500">Meeting Place</label>
                                <input
                                  type="text"
                                  className="w-full p-2 border rounded"
                                  placeholder="Property address / office / landmark"
                                  value={respForm.meetingPlace}
                                  onChange={(e) => setRespForm((p) => ({ ...p, meetingPlace: e.target.value }))}
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-bold text-gray-500">Note</label>
                            <textarea
                              className="w-full p-2 border rounded"
                              rows="2"
                              value={respForm.sellerNote}
                              onChange={(e) => setRespForm((p) => ({ ...p, sellerNote: e.target.value }))}
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={submitResponse}
                              className="bg-black text-white px-3 py-2 rounded hover:bg-gray-900 text-sm"
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveResponse(null)}
                              className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-400 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 italic mb-3">
                    "{msg.message}"
                  </div>

                  {/* Footer: Property Link */}
                  <p className="text-sm font-bold text-gray-500 flex items-center gap-1">
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

      {/* --- LISTINGS CONTENT --- */}
      {activeTab === 'listings' && (
        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Properties</h2>
          {properties.length > 0 ? (
            properties.map((p) => (
               <div key={p._id} className="flex justify-between items-center border-b border-gray-100 py-4 last:border-0 hover:bg-gray-50 px-2 rounded transition">
                 <div className="flex items-center gap-4">
                   <img src={p.images[0]?.url} alt="property" className="w-16 h-12 rounded object-cover shadow-sm" />
                   <div>
                     <p className="font-bold text-gray-800">{p.title}</p>
                     <p className={`text-xs font-bold uppercase ${p.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                       {p.status}
                     </p>
                   </div>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => navigate(`/property/${p._id}`)} className="text-gray-400 hover:text-blue-600 transition" title="View"><FaEye size={20}/></button>
                    <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-600 transition" title="Delete"><FaTrash size={18}/></button>
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