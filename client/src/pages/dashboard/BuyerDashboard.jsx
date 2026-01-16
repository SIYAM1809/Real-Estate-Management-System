import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites } from '../../features/favorites/favoriteSlice';
import PropertyItem from '../../components/properties/PropertyItem';

function BuyerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Default to empty array if undefined
  const { favorites = [] } = useSelector((state) => state.favorites) || {};
  
  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Buyer Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
           <span className="text-2xl">❤️</span>
           <h2 className="text-xl font-bold text-gray-800">My Favorite Homes</h2>
        </div>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav) => (
                // SAFEGUARD: Only render if we actually have an object with an ID
                // This prevents crashes if the backend sends null or bad data
                (fav && fav._id) ? (
                  <PropertyItem key={fav._id} property={fav} />
                ) : null
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
             <p className="text-gray-500 text-lg mb-2">You haven't liked any properties yet.</p>
             <p className="text-sm text-gray-400">Browse homes and click the heart icon to save them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerDashboard;