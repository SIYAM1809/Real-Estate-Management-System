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
        <div className="card p-8 animate-pulse">
          <div className="h-8 w-2/3 bg-slate-100 rounded" />
          <div className="mt-4 h-64 bg-slate-100 rounded-2xl" />
          <div className="mt-4 h-4 w-1/2 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="container-shell py-16 text-center text-red-600">Error: {errorMsg}</div>;
  }

  return (
    <div className="bg-noise min-h-screen">
      <div className="container-shell py-10">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-6"
        >
          <FaArrowLeft /> Back to Listings
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden shadow-soft">
          {/* GALLERY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-8">
              <div className="relative h-[320px] sm:h-[420px] bg-slate-100">
                <img src={heroImage} alt={property.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="chip">{property?.category}</span>
                      <span className="chip">{property?.location?.city || "City"}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow">
                      {property.title}
                    </h1>
                    <div className="mt-2 text-white/90 text-sm flex items-center gap-2">
                      <FaMapMarkerAlt />
                      <span>
                        {property.location?.address}, {property.location?.city}
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-white/90">
                    <FaImages />
                    <span className="text-sm font-semibold">{images.length || 1} photos</span>
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto bg-white border-t border-slate-200">
                  {images.map((src, idx) => (
                    <button
                      key={src + idx}
                      onClick={() => setActiveImg(idx)}
                      className={`h-16 w-24 rounded-xl overflow-hidden border transition ${
                        idx === activeImg ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300"
                      }`}
                      aria-label={`Image ${idx + 1}`}
                    >
                      <img src={src} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* DESCRIPTION + MAP */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-xs font-bold text-slate-500 uppercase">Land Category</div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">{property.category}</div>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Description</h2>
                  <p className="mt-2 text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="card p-5 sm:p-6"
                >
                  <h2 className="text-xl font-extrabold text-slate-900 mb-3">Location</h2>
                  <div className="h-[360px] w-full rounded-2xl overflow-hidden border border-slate-200">
                    <PropertyMap lat={property?.location?.lat} lng={property?.location?.lng} title={property?.title} />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white">
              <div className="p-6 sm:p-8 lg:sticky lg:top-24">
                <div className="card p-5">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Price</div>
                  <div className="text-3xl font-extrabold text-emerald-600 flex items-center gap-2">
                    <FaMoneyBillWave /> {priceText}
                  </div>

                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <div className="text-xs font-bold text-blue-600 uppercase">Listed by</div>
                    <div className="mt-1 text-base font-extrabold text-slate-900">{property.seller?.name}</div>
                  </div>

                  <div className="mt-5">
                    {!isLoggedIn ? (
                      <button
                        onClick={() => {
                          toast.info("Login as a buyer to contact the seller");
                          navigate("/login");
                        }}
                        className="btn-soft w-full py-3"
                      >
                        <FaEnvelope className="mr-2" /> Login to Contact
                      </button>
                    ) : !isBuyer ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center font-semibold text-slate-700">
                        Only buyers can contact sellers ✋
                      </div>
                    ) : !showForm ? (
                      <button onClick={() => setShowForm(true)} className="btn-soft w-full py-3">
                        <FaEnvelope className="mr-2" /> Contact / Schedule Visit
                      </button>
                    ) : null}
                  </div>

                  {/* Animated Inquiry Form */}
                  <AnimatePresence>
                    {showForm && isLoggedIn && isBuyer && (
                      <motion.form
                        onSubmit={onInquirySubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                            <input
                              type="radio"
                              name="type"
                              value="message"
                              checked={inquiryType === "message"}
                              onChange={() => setInquiryType("message")}
                            />
                            Message
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-blue-700">
                            <input
                              type="radio"
                              name="type"
                              value="appointment"
                              checked={inquiryType === "appointment"}
                              onChange={() => setInquiryType("appointment")}
                            />
                            Request Visit
                          </label>
                        </div>

                        {inquiryType === "appointment" && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="label">Date</label>
                              <input
                                type="date"
                                className="input"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="label">Time</label>
                              <input
                                type="time"
                                className="input"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="label">Additional Note</label>
                          <textarea
                            className="input min-h-[90px]"
                            placeholder={
                              inquiryType === "appointment"
                                ? "I would like to see the land boundary..."
                                : "Is the price negotiable?"
                            }
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <button type="submit" className="btn-primary flex-1 py-3">
                            <FaPaperPlane className="mr-2" />
                            {inquiryType === "appointment" ? "Request Appointment" : "Send Message"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="btn-outline px-4"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* REVIEWS SUMMARY */}
                <div className="mt-6 card p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-slate-900">Reviews</h2>
                    <div className="text-sm font-bold text-slate-700">
                      {propertyReviews?.average || 0} / 5 ({propertyReviews?.count || 0})
                    </div>
                  </div>

                  {propertyReviews?.reviews?.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {propertyReviews.reviews.map((r) => (
                        <div key={r._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-slate-900">{r.buyer?.name || "Buyer"}</div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <FaStar />
                              <span className="text-slate-700 font-bold">{r.rating}</span>
                            </div>
                          </div>
                          <p className="text-slate-700 mt-2 italic">
                            {r.comment ? `"${r.comment}"` : "(No comment)"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-600">
                      No approved reviews yet.
                    </div>
                  )}

                  {isLoggedIn && isBuyer && (
                    <form onSubmit={onReviewSubmit} className="mt-6 border-t border-slate-200 pt-5 space-y-3">
                      <h3 className="text-sm font-extrabold text-slate-900">Write a review</h3>

                      <div>
                        <label className="label">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="input"
                        >
                          {[5, 4, 3, 2, 1].map((x) => (
                            <option key={x} value={x}>
                              {x} Star{x > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label">Comment (optional)</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="input min-h-[90px]"
                          placeholder="Your experience..."
                        />
                      </div>

                      <button className="btn-soft w-full py-3">Submit Review (Admin approval required)</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PropertyDetails;
