import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBed, FaMapMarkerAlt, FaHeart, FaRegHeart, FaMoneyBillWave } from 'react-icons/fa';
import { toggleFavorite } from '../../features/favorites/favoriteSlice';
import { toast } from 'react-toastify';

function PropertyItem({ property }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites = [], isLoading } = useSelector((state) => state.favorites) || {};

  // --- UNIVERSAL CHECK ---
  // This works for both Strings (Old Backend) and Objects (New Backend)
  const isFavorite = favorites.some((fav) => {
      // 1. If fav is null (Zombie Data), ignore it
      if (!fav) return false;
      
      // 2. Get the ID string safely
      const favId = fav._id ? fav._id.toString() : fav.toString();
      const currentId = property._id ? property._id.toString() : '';

      return favId === currentId;
  });
  // -----------------------

  const handleFavorite = async (e) => {
    e.preventDefault(); 
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    
    try {
      await dispatch(toggleFavorite(property._id)).unwrap();
      
      // Optimistic UI Feedback
      if(isFavorite) {
          toast.info('Removed from favorites');
      } else {
          toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error || 'Failed to update favorites');
      console.error('Favorite toggle error:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 relative group">
      
      {/* HEART BUTTON */}
      <button 
        onClick={handleFavorite}
        disabled={isLoading}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
            <div className="animate-spin">
              <FaHeart className="text-gray-400 text-xl" />
            </div>
        ) : isFavorite ? (
            <FaHeart className="text-red-500 text-xl" />
        ) : (
            <FaRegHeart className="text-gray-400 text-xl" />
        )}
      </button>

      <Link to={`/property/${property._id}`}>
        <div className="h-56 overflow-hidden bg-gray-200">
           {/* Safe Image Check */}
           <img 
             src={property.images && property.images.length > 0 ? property.images[0].url : "https://via.placeholder.com/300"} 
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
             <FaMapMarkerAlt className="mr-1" /> {property.location?.city || "Unknown"}
          </div>

          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <span className="text-2xl font-bold text-blue-600 flex items-center gap-1">
               <FaMoneyBillWave className="text-lg"/> {property.price?.toLocaleString()}
            </span>
            <div className="flex items-center gap-2 text-gray-500">
               <FaBed /> {property.rooms} Beds
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PropertyItem;