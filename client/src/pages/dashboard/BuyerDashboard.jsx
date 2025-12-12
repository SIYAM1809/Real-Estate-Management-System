import { FaHeart, FaEnvelope, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function BuyerDashboard({ user }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user && user.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Browse Properties</h3>
            <FaSearch className="text-blue-500 text-2xl" />
          </div>
          <p className="text-gray-600 mb-4">Find your dream home from our listings.</p>
          <Link to="/properties" className="text-blue-600 font-bold hover:underline">Start Searching &rarr;</Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">My Favorites</h3>
            <FaHeart className="text-red-500 text-2xl" />
          </div>
          <p className="text-gray-600 mb-4">View properties you have saved.</p>
          <button className="text-red-600 font-bold hover:underline">View Favorites &rarr;</button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">My Inquiries</h3>
            <FaEnvelope className="text-green-500 text-2xl" />
          </div>
          <p className="text-gray-600 mb-4">Check status of your offers.</p>
          <button className="text-green-600 font-bold hover:underline">View Inquiries &rarr;</button>
        </div>

      </div>
    </div>
  );
}
export default BuyerDashboard;