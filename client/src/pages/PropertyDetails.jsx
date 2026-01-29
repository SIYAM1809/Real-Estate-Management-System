import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProperty } from "../features/properties/propertySlice";
import PropertyMap from "../components/map/PropertyMap";
import { createInquiry, reset as resetInquiry } from "../features/inquiries/inquirySlice";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaMoneyBillWave,
  FaEnvelope,
  FaPaperPlane,
  FaStar,
  FaImages,
  FaCheckCircle
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getPropertyReviews, createReview as createReviewAction } from "../features/reviews/reviewSlice";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [inquiryType, setInquiryType] = useState("message");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [activeImg, setActiveImg] = useState(0);

  const { property, isLoading, isError, message: errorMsg } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);

  const { isSuccess: inquirySuccess, isError: inquiryError, message: inquiryMsg } = useSelector(
    (state) => state.inquiries
  );

  const { propertyReviews, isError: reviewError, isSuccess: reviewSuccess, message: reviewMsg } = useSelector(
    (state) => state.reviews
  );

  const isBuyer = user?.role === "buyer";
  const isLoggedIn = !!user;

  useEffect(() => {
    dispatch(getProperty(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (id) dispatch(getPropertyReviews(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (inquiryError) {
      toast.error(inquiryMsg);
      dispatch(resetInquiry());
    }
    if (inquirySuccess) {
      toast.success("Message sent to seller ✅");
      setShowForm(false);
      setMessage("");
      setDate("");
      setTime("");
      setInquiryType("message");
      dispatch(resetInquiry());
    }
  }, [inquiryError, inquirySuccess, inquiryMsg, dispatch]);

  useEffect(() => {
    if (reviewError) toast.error(reviewMsg);
    if (reviewSuccess) {
      toast.info("Review submitted. Waiting for admin approval ✅");
      setReviewText("");
      setRating(5);
      dispatch(getPropertyReviews(id));
    }
  }, [reviewError, reviewMsg, reviewSuccess, dispatch, id]);

  const images = useMemo(() => {
    const arr = property?.images || [];
    // supports both [{url}] and ["url"]
    return arr.map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
  }, [property?.images]);

  const heroImage = images?.[activeImg] || "https://via.placeholder.com/1200x700";

  const priceText = useMemo(() => {
    const p = Number(property?.price || 0);
    return p ? `$${p.toLocaleString()}` : "N/A";
  }, [property?.price]);

  const onInquirySubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to contact the seller");
      navigate("/login");
      return;
    }
    if (!isBuyer) {
      toast.error("Only buyers can send inquiries.");
      return;
    }
    if (inquiryType === "appointment" && (!date || !time)) {
      toast.error("Please select appointment date and time");
      return;
    }

    const data = {
      message,
      propertyId: property._id,
      type: inquiryType,
      appointmentDate: inquiryType === "appointment" ? date : undefined,
      appointmentTime: inquiryType === "appointment" ? time : undefined,
    };

    dispatch(createInquiry(data));
  };

  const onReviewSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Login as a buyer to review.");
      navigate("/login");
      return;
    }
    if (!isBuyer) {
      toast.error("Only buyers can post reviews.");
      return;
    }

    dispatch(
      createReviewAction({
        propertyId: property._id,
        rating,
        comment: reviewText,
      })
    );
  };

  if (isLoading || !property?.title) {
    return (
      <div className="container-shell py-16">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
          <div className="h-8 w-2/3 bg-slate-200 rounded" />
          <div className="h-[450px] bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 h-40 bg-slate-200 rounded-2xl" />
            <div className="h-96 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="container-shell py-20 text-center text-red-600 font-bold bg-red-50 rounded-xl my-10">Error: {errorMsg}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* HERO / IMAGE SECTION */}
      <div className="relative h-[450px] lg:h-[550px] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img src={heroImage} alt={property.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="container-shell relative h-full flex flex-col justify-end pb-12">
          <Link
            to="/properties"
            className="absolute top-8 left-4 lg:left-8 inline-flex items-center gap-2 text-white/80 hover:text-white transition bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium hover:bg-black/40"
          >
            <FaArrowLeft /> Back to Listings
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wide">
                {property?.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wide">
                {property?.location?.city}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-2 shadow-sm">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-slate-300 text-lg">
              <FaMapMarkerAlt className="text-primary-400" />
              <span>{property.location?.address}, {property.location?.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-shell -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-8">

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="card p-4 flex gap-4 overflow-x-auto">
                {images.map((src, idx) => (
                  <button
                    key={src + idx}
                    onClick={() => setActiveImg(idx)}
                    className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden transition-all ${idx === activeImg ? "ring-2 ring-primary-500 ring-offset-2" : "opacity-70 hover:opacity-100"
                      }`}
                  >
                    <img src={src} alt={`view ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* DETAILS CARD */}
            <div className="card p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Property Overview</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold uppercase">Type</div>
                  <div className="text-slate-900 font-bold">{property.category}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold uppercase">Status</div>
                  <div className="text-emerald-600 font-bold">Available</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold uppercase">Area</div>
                  <div className="text-slate-900 font-bold">{property.area || "N/A"} sqft</div>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div className="card p-8 overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Location Map</h3>
              <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200">
                <PropertyMap lat={property?.location?.lat} lng={property?.location?.lng} title={property?.title} />
              </div>
            </div>

            {/* REVIEWS */}
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Guest Reviews</h3>
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold text-slate-800">{propertyReviews?.average || 0}</span>
                  <span className="text-slate-500 text-sm">({propertyReviews?.count || 0} reviews)</span>
                </div>
              </div>

              {propertyReviews?.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {propertyReviews.reviews.map((r) => (
                    <div key={r._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-slate-900">{r.buyer?.name || "Verified Buyer"}</div>
                          <div className="text-xs text-slate-500">Verified Review</div>
                        </div>
                        <div className="flex text-yellow-500 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < r.rating ? "text-yellow-400" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
                  No reviews yet. Be the first to review!
                </div>
              )}

              {isLoggedIn && isBuyer && (
                <form onSubmit={onReviewSubmit} className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4">Leave a Review</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${rating >= star ? "bg-yellow-400 text-white shadow-lg shadow-yellow-400/30 scale-105" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                              }`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label">Your Experience</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="input min-h-[100px]"
                        placeholder="Share your thoughts about this property..."
                      />
                    </div>

                    <button className="btn-primary">Submit Review</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            {/* PRICE CARD */}
            <div className="card p-6 shadow-xl shadow-slate-200/50 sticky top-24">
              <div className="mb-6">
                <div className="text-sm font-medium text-slate-500 mb-1">Asking Price</div>
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{priceText}</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                  {property.seller?.name?.[0] || "S"}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Listed by</div>
                  <div className="font-bold text-slate-900">{property.seller?.name || "Seller"}</div>
                </div>
              </div>

              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    toast.info("Login as a buyer to contact the seller");
                    navigate("/login");
                  }}
                  className="btn-primary w-full py-4 text-lg shadow-lg shadow-primary-500/30"
                >
                  Login to Contact
                </button>
              ) : !isBuyer ? (
                <div className="p-4 bg-orange-50 text-orange-700 rounded-xl text-center font-medium text-sm">
                  <FaCheckCircle className="inline mr-2" />
                  Only verified buyers can contact sellers
                </div>
              ) : (
                !showForm ? (
                  <button onClick={() => setShowForm(true)} className="btn-primary w-full py-4 text-base shadow-lg shadow-primary-500/30">
                    Contact Seller
                  </button>
                ) : (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-900">Send Inquiry</h4>
                      <button onClick={() => setShowForm(false)} className="text-xs text-red-500 hover:underline">Cancel</button>
                    </div>

                    <form onSubmit={onInquirySubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setInquiryType("message")}
                          className={`py-2 text-sm font-medium rounded-lg transition-all ${inquiryType === "message" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                          Message
                        </button>
                        <button
                          type="button"
                          onClick={() => setInquiryType("appointment")}
                          className={`py-2 text-sm font-medium rounded-lg transition-all ${inquiryType === "appointment" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                          Visit
                        </button>
                      </div>

                      {inquiryType === "appointment" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Date</label>
                            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="input py-2 text-xs" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Time</label>
                            <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="input py-2 text-xs" />
                          </div>
                        </div>
                      )}

                      <textarea
                        required
                        placeholder={inquiryType === 'message' ? "Hi, I'm interested in this property..." : "I'd like to schedule a visit..."}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="input min-h-[100px]"
                      />

                      <button type="submit" className="btn-primary w-full">Send Inquiry</button>
                    </form>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
