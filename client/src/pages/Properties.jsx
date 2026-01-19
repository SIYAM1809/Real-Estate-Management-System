import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFavorites } from '../features/favorites/favoriteSlice';
import PropertyItem from '../components/properties/PropertyItem';
import { FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE } from '../utils/apiBase';

const LAND_CATEGORIES = [
  'Residential Plot',
  'Commercial Plot',
  'Agricultural Land',
  'Industrial Land',
];

function Properties() {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    keyword: '',
    city: '',
    category: 'All',
    maxPrice: '',
  });

  const [displayProperties, setDisplayProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchFilteredProperties();

    // ✅ Only fetch favorites if logged in AND buyer
    if (user?.role === 'buyer') {
      dispatch(getFavorites());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  const fetchFilteredProperties = async () => {
    setLoading(true);
    try {
      const queryStr = `${API_BASE}/api/properties?keyword=${encodeURIComponent(
        filters.keyword
      )}&city=${encodeURIComponent(filters.city)}&category=${encodeURIComponent(
        filters.category
      )}&maxPrice=${encodeURIComponent(filters.maxPrice)}`;

      const response = await axios.get(queryStr);
      setDisplayProperties(response.data || []);
    } catch (error) {
      console.error('Search Error:', error?.message || error);
      setDisplayProperties([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredProperties();
  };

  const onChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEARCH BAR */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10 border border-gray-100">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Keyword
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={onChange}
                placeholder="Search land..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={onChange}
              placeholder="e.g. Dhaka"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Land Type
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="All">All Types</option>
              {LAND_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <FaFilter /> Search
            </button>
          </div>
        </form>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Available Land Listings
      </h1>

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">Searching...</div>
      ) : displayProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property) => (
            <PropertyItem key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
          <h3 className="text-xl text-gray-500">No listings found.</h3>
        </div>
      )}
    </div>
  );
}

export default Properties;
