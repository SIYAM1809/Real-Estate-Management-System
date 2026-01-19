import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaMoneyBillWave } from 'react-icons/fa';
import { toggleFavorite } from '../../features/favorites/favoriteSlice';
import { toast } from 'react-toastify';

function PropertyItem({ property }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites = [] } = useSelector((state) => state.favorites) || {};

  // ✅ Buyer-only favorites
  const canUseFavorites = Boolean(user && user.role === 'buyer');

  const isFavorite = canUseFavorites
    ? favorites.some((fav) => {
        if (!fav) return false;
        const favId = fav._id ? fav._id.toString() : fav.toString();
        const currentId = property?._id ? property._id.toString() : '';
        return favId === currentId;
      })
    : false;

  const handleFavorite = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    if (user.role !== 'buyer') {
      toast.error('Favorites are available for buyers only.');
      return;
    }

    dispatch(toggleFavorite(property._id));

    if (isFavorite) toast.info('Removed from favorites');
    else toast.success('Added to favorites');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 relative group">
      {/* ✅ Heart button ONLY for Buyer */}
      {canUseFavorites && (
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-400 text-xl" />
          )}
        </button>
      )}

      <Link to={`/property/${property._id}`}>
        <div className="h-56 overflow-hidden bg-gray-200">
          <img
            src={
              property.images && property.images.length > 0
                ? property.images[0].url
                : 'https://via.placeholder.com/300'
            }
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800 truncate">{property.title}</h3>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
              {property.category}
            </span>
          </div>

          <div className="flex items-center text-gray-500 mb-4 text-sm">
            <FaMapMarkerAlt className="mr-1" /> {property.location?.city || 'Unknown'}
          </div>

          {/* ✅ Bedrooms removed (Land-only UI) */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <span className="text-2xl font-bold text-blue-600 flex items-center gap-1">
              <FaMoneyBillWave className="text-lg" /> {property.price?.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PropertyItem;
