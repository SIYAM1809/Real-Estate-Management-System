import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Find Your Dream Property <span className="text-blue-600">Today</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        The most secure marketplace for Buyers, Sellers, and Agents.
      </p>
      <div className="space-x-4">
        <Link to="/properties" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          Browse Properties
        </Link>
        <Link to="/register" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
          Join Now
        </Link>
      </div>
    </div>
  )
}
export default Home;