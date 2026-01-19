import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createProperty, reset } from '../features/properties/propertySlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCloudUploadAlt, FaMoneyBillWave, FaHome } from 'react-icons/fa';
import MapPicker from "../components/map/MapPicker";

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
    setImage(file);
    setPreview(URL.createObjectURL(file));
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
    return <div className="text-center mt-20 text-2xl animate-pulse">Uploading listing...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 w-fit">
        <FaArrowLeft /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaHome className="text-blue-600" /> Add New Land Listing
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Listing Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="e.g. 5 Katha Residential Plot in Gulshan"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={onChange}
              placeholder="Plot details, nearby landmarks, road width, papers info, etc."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Price ($)</label>
              <div className="relative">
                <FaMoneyBillWave className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={price}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Land Type</label>
              <select
                name="category"
                value={category}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LAND_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={city}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* ✅ Map picker */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Select Land Location on Map</label>
            <MapPicker value={mapPoint} onChange={setMapPoint} />
          </div>

          <input type="hidden" name="rooms" value="0" readOnly />

          <div>
            <label className="block text-gray-700 font-bold mb-2">Upload Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
              <input
                type="file"
                onChange={onImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              {preview ? (
                <img src={preview} alt="Preview" className="h-40 mx-auto object-cover rounded shadow" />
              ) : (
                <div className="text-gray-500">
                  <FaCloudUploadAlt className="text-4xl mx-auto mb-2" />
                  <p>Click to upload or drag & drop</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md"
          >
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;
