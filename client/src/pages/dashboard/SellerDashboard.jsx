import { FaPlusCircle, FaListAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function SellerDashboard({ user }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Add Property</h3>
            <FaPlusCircle className="text-purple-500 text-2xl" />
          </div>
          <p className="text-gray-600 mb-4">List a new property for sale.</p>
          <Link to="/add-property" className="text-purple-600 font-bold hover:underline">Create Listing &rarr;</Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">My Listings</h3>
            <FaListAlt className="text-blue-500 text-2xl" />
          </div>
          <p className="text-gray-600 mb-4">Manage availability and edit details.</p>
          <button className="text-blue-600 font-bold hover:underline">Manage Listings &rarr;</button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Client Inquiries</h3>
            <FaEnvelopeOpenText className="text-yellow-500 text-2xl" />
          </div>
          <p className="text-gray-600 mb-4">Respond to potential buyers.</p>
          <button className="text-yellow-600 font-bold hover:underline">View Messages &rarr;</button>
        </div>

      </div>
    </div>
  );
}
export default SellerDashboard;