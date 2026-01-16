import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMyProperties, deleteProperty, reset } from '../../features/properties/propertySlice';
import { getMyInquiries } from '../../features/inquiries/inquirySlice';
import { FaTrash, FaPlus, FaEye, FaEnvelope, FaHome, FaCalendarAlt, FaClock } from 'react-icons/fa';

function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('listings');

  const { user } = useSelector((state) => state.auth);
  // Ensure we have defaults if state is empty
  const { properties = [], isLoading } = useSelector((state) => state.properties) || {};
  const { inquiries = [] } = useSelector((state) => state.inquiries) || {};

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getMyProperties());
      dispatch(getMyInquiries());
    }
    return () => { dispatch(reset()); };
  }, [user, navigate, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this property?')) dispatch(deleteProperty(id));
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
            inquiries.map((msg) => (
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
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-3 flex items-center gap-4">
                    <div className="flex items-center gap-2 font-bold">
                       <FaCalendarAlt /> {msg.appointmentDate}
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                       <FaClock /> {msg.appointmentTime}
                    </div>
                    <span className="ml-auto text-xs font-bold uppercase tracking-wider bg-blue-200 px-2 py-1 rounded text-blue-800">
                      Visit Request
                    </span>
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
            ))
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