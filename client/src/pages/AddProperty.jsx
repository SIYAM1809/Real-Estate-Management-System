import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProperty, reset } from '../features/properties/propertySlice';
import FormInput from '../components/common/FormInput';
import { FaHome } from 'react-icons/fa';

function AddProperty() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    category: 'Apartment',
    rooms: '',
  });
  const [image, setImage] = useState(null); // Separate state for file

  const { title, description, price, address, city, category, rooms } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('Property Listed Successfully! Waiting for Admin Approval.');
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onMutate = (e) => {
    // Check if input is a file
    if (e.target.files) {
      setImage(e.target.files[0]);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Create FormData object to send file + text
    const propertyData = new FormData();
    propertyData.append('title', title);
    propertyData.append('description', description);
    propertyData.append('price', price);
    propertyData.append('address', address);
    propertyData.append('city', city);
    propertyData.append('category', category);
    propertyData.append('rooms', rooms);
    propertyData.append('image', image);

    dispatch(createProperty(propertyData));
  };

  if (isLoading) return <div className="text-center mt-20 text-xl">Uploading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <FaHome className="text-4xl text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">List Your Property</h1>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* We use standard HTML inputs here for custom ID handling needed for onMutate */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Title</label>
              <input type="text" id="title" value={title} onChange={onMutate} className="border p-2 w-full rounded" required />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Price ($)</label>
              <input type="number" id="price" value={price} onChange={onMutate} className="border p-2 w-full rounded" required />
            </div>
          </div>

          <div className="mb-4">
             <label className="block text-gray-700 font-bold mb-2">Description</label>
             <textarea id="description" value={description} onChange={onMutate} className="border p-2 w-full rounded h-24" required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input type="text" id="address" value={address} onChange={onMutate} className="border p-2 w-full rounded" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">City</label>
              <input type="text" id="city" value={city} onChange={onMutate} className="border p-2 w-full rounded" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Rooms</label>
              <input type="number" id="rooms" value={rooms} onChange={onMutate} className="border p-2 w-full rounded" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <select id="category" value={category} onChange={onMutate} className="border p-2 w-full rounded">
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Property Image</label>
            <input type="file" id="image" onChange={onMutate} className="border p-2 w-full rounded" accept="image/*" required />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;