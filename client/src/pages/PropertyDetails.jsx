import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProperty } from '../features/properties/propertySlice';
import { createInquiry, reset as resetInquiry } from '../features/inquiries/inquirySlice';
import { FaBed, FaMapMarkerAlt, FaArrowLeft, FaMoneyBillWave, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [inquiryType, setInquiryType] = useState('message');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const { property, isLoading, isError, message: errorMsg } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  const { isSuccess: inquirySuccess, isError: inquiryError, message: inquiryMsg } = useSelector((state) => state.inquiries);

  useEffect(() => {
    dispatch(getProperty(id));
  }, [dispatch, id]);

  // Handle Inquiry Response
  useEffect(() => {
    if (inquiryError) {
      toast.error(inquiryMsg);
      dispatch(resetInquiry());
    }
    if (inquirySuccess) {
      toast.success('Message sent to seller!');
      setShowForm(false);
      setMessage('');
      dispatch(resetInquiry());
    }
  }, [inquiryError, inquirySuccess, inquiryMsg, dispatch]);

  // Update onSubmit
  const onInquirySubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send a message');
      navigate('/login');
      return;
    }

    const data = {
      message,
      propertyId: property._id,
      sellerId: property.seller._id,
      email: user.email,
      type: inquiryType,      // <--- Send Type
      appointmentDate: date,  // <--- Send Date
      appointmentTime: time   // <--- Send Time
    };
    dispatch(createInquiry(data));
  };

  if (isLoading || !property.title) return <div className="text-center mt-20 text-2xl animate-pulse">Loading...</div>;
  if (isError) return <div className="text-center mt-20 text-red-500">Error: {errorMsg}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/properties" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 w-fit transition">
        <FaArrowLeft /> Back to Listings
      </Link>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="h-[400px] w-full relative bg-gray-200 group">
           <img 
             src={property.images && property.images[0] ? property.images[0].url : 'https://via.placeholder.com/800'} 
             alt={property.title} 
             className="w-full h-full object-cover"
           />
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <h1 className="text-4xl font-extrabold text-gray-800">{property.title}</h1>
              <div className="flex items-center text-gray-500 text-lg">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {property.location?.address}, {property.location?.city}
              </div>
              <div className="flex items-center gap-8 py-6 border-y border-gray-100 bg-gray-50 px-6 rounded-lg">
                 <div className="flex items-center gap-3">
                    <FaBed className="text-3xl text-blue-500" />
                    <span className="font-bold text-xl">{property.rooms} Bedrooms</span>
                 </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{property.description}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit shadow-lg">
               <div className="mb-6 pb-6 border-b border-gray-100">
                 <p className="text-gray-400 text-sm uppercase font-bold mb-1">Price</p>
                 <div className="text-4xl font-bold text-green-600 flex items-center gap-2">
                   <FaMoneyBillWave className="text-3xl" /> ${property.price?.toLocaleString()}
                 </div>
               </div>

               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                 <p className="text-xs text-blue-500 font-bold uppercase mb-1">Listed by</p>
                 <p className="font-bold text-lg text-gray-800">{property.seller?.name}</p>
               </div>

               {/* CONTACT FORM TOGGLE */}
               {!showForm ? (
                 <button 
                    onClick={() => setShowForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition shadow-md flex items-center justify-center gap-2"
                 >
                   <FaEnvelope /> Contact / Schedule Visit
                 </button>
               ) : (
                 <form onSubmit={onInquirySubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
                   
                   {/* TYPE SELECTOR */}
                   <div className="flex gap-4 mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" value="message" checked={inquiryType === 'message'} onChange={() => setInquiryType('message')} />
                        <span>Message</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" value="appointment" checked={inquiryType === 'appointment'} onChange={() => setInquiryType('appointment')} />
                        <span className="font-bold text-blue-600">Request Visit</span>
                      </label>
                   </div>

                   {/* DATE PICKERS (Only show if Appointment) */}
                   {inquiryType === 'appointment' && (
                     <div className="grid grid-cols-2 gap-2 animate-fade-in">
                        <div>
                          <label className="text-xs font-bold text-gray-500">Date</label>
                          <input type="date" className="w-full p-2 border rounded" required={inquiryType === 'appointment'} 
                            onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500">Time</label>
                          <input type="time" className="w-full p-2 border rounded" required={inquiryType === 'appointment'} 
                            onChange={(e) => setTime(e.target.value)} />
                        </div>
                     </div>
                   )}

                   <label className="text-sm font-bold text-gray-700">Additional Note</label>
                   <textarea 
                      className="w-full p-2 border rounded focus:outline-blue-500"
                      rows="3"
                      placeholder={inquiryType === 'appointment' ? "I would like to see the backyard..." : "Is the price negotiable?"}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                   ></textarea>

                   <div className="flex gap-2">
                     <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex justify-center items-center gap-2">
                        <FaPaperPlane /> {inquiryType === 'appointment' ? 'Request Appointment' : 'Send Message'}
                     </button>
                     <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Cancel
                     </button>
                   </div>
                 </form>
               )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;