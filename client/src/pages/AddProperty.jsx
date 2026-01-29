import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createProperty, reset } from '../features/properties/propertySlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCloudUploadAlt, FaMoneyBillWave, FaHome, FaMapMarkedAlt, FaCity } from 'react-icons/fa';
import MapPicker from "../components/map/MapPicker";
import { motion } from 'framer-motion';

const LAND_CATEGORIES = [
  'Residential Plot',
  'Commercial Plot',
  'Agricultural Land',
  'Industrial Land',
];

function AddProperty() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    category: LAND_CATEGORIES[0],
    rooms: 0,
  });

  const [mapPoint, setMapPoint] = useState(null); // ✅ {lat, lng}
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { title, description, price, address, city, category } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.properties);

  useEffect(() => {
    if (isError) toast.error(message);

    if (isSuccess && isSubmitted) {
      toast.success('Listing submitted for approval!');
      navigate('/dashboard');
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch, isSubmitted]);

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    // ✅ Require map selection (so map is always useful)
    if (!mapPoint) {
      toast.error("Please select the land location on the map");
      return;
    }

    const propertyData = new FormData();
    propertyData.append('title', title);
    propertyData.append('description', description);
    propertyData.append('price', price);
    propertyData.append('address', address);
    propertyData.append('city', city);
    propertyData.append('category', category);

    propertyData.append('rooms', '0');
    propertyData.append('lat', String(mapPoint.lat));
    propertyData.append('lng', String(mapPoint.lng));

    propertyData.append('image', image);

    setIsSubmitted(true);
    dispatch(createProperty(propertyData));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-xl font-bold text-slate-700">Uploading your listing...</p>
      </div>
    );
  }

  return (
    <div className="container-shell py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition mb-8 font-medium">
        <FaArrowLeft /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-soft overflow-hidden border border-slate-100"
      >
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <FaHome className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Land Listing</h1>
              <p className="text-slate-300 text-sm">Fill in the details to publish your property</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-8">

          {/* SECTION 1: BASIC INFO */}
          <section className="space-y-6">
            <h3 className="section-title text-sm uppercase tracking-wide text-slate-500 font-bold border-b border-slate-100 pb-2 mb-4">Basic Information</h3>

            <div>
              <label className="label">Listing Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="e.g. 5 Katha Residential Plot in Gulshan"
                className="input text-lg font-medium"
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Plot details, nearby landmarks, road width, papers info, etc."
                className="input h-32 leading-relaxed"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Price ($)</label>
                <div className="relative group">
                  <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={onChange}
                    className="input pl-11 font-mono text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Land Type</label>
                <select
                  name="category"
                  value={category}
                  onChange={onChange}
                  className="input bg-white appearance-none"
                >
                  {LAND_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 2: LOCATION */}
          <section className="space-y-6">
            <h3 className="section-title text-sm uppercase tracking-wide text-slate-500 font-bold border-b border-slate-100 pb-2 mb-4">Location Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <label className="label">Address</label>
                <div className="relative group">
                  <FaMapMarkedAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" />
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={onChange}
                    className="input pl-11"
                    placeholder="Street address, Area"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">City</label>
                <div className="relative group">
                  <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" />
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={onChange}
                    className="input pl-11"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ✅ Map picker */}
            <div>
              <label className="label mb-2 block">Pin Location on Map <span className="text-red-500">*</span></label>
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <MapPicker value={mapPoint} onChange={setMapPoint} />
              </div>
              <p className="text-xs text-slate-500 mt-2">Click on the map to set the exact location of the land.</p>
            </div>
          </section>

          {/* SECTION 3: MEDIA */}
          <section className="space-y-6">
            <h3 className="section-title text-sm uppercase tracking-wide text-slate-500 font-bold border-b border-slate-100 pb-2 mb-4">Property Image</h3>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-primary-400 transition cursor-pointer relative group bg-slate-50/50">
              <input
                type="file"
                onChange={onImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
              />
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="h-64 mx-auto object-cover rounded-xl shadow-md" />
                  <div className="mt-4 text-sm text-primary-600 font-bold">Click to change image</div>
                </div>
              ) : (
                <div className="text-slate-500 group-hover:text-primary-600 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FaCloudUploadAlt className="text-3xl" />
                  </div>
                  <p className="text-lg font-medium">Click to upload property image</p>
                  <p className="text-sm mt-1 opacity-70">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </section>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddProperty;
