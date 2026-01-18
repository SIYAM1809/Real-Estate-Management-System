import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaUserTie, FaStar } from "react-icons/fa";
import { API_BASE } from "../../utils/apiBase";

function AdminDashboard() {
  const [adminProperties, setAdminProperties] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchAdminData = async () => {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE}/api/properties/admin-all`, config);
      setAdminProperties(res.data);
    };

    fetchAdminData();
  }, [user, navigate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `${API_BASE}/api/properties/${id}/status`,
        { status: newStatus },
        config
      );

      setAdminProperties((prev) =>
        prev.map((prop) => (prop._id === id ? { ...prop, status: newStatus } : prop))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserTie /> Admin Control Panel
        </h1>

        {/* ✅ Option 1: Reviews live on a separate admin page */}
        <button
          onClick={() => navigate("/admin-reviews")}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black flex items-center gap-2"
        >
          <FaStar /> Manage Reviews
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white uppercase text-sm">
              <th className="py-3 px-6">Property</th>
              <th className="py-3 px-6">Seller</th>
              <th className="py-3 px-6">Current Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm">
            {adminProperties.map((property) => (
              <tr key={property._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 font-bold">{property.title}</td>
                <td className="py-3 px-6">{property.seller?.name || "Unknown"}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                      ${
                        property.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : property.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                  >
                    {String(property.status || "").toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleStatusChange(property._id, "approved")}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    title="Approve"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleStatusChange(property._id, "rejected")}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    title="Reject"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}

            {adminProperties.length === 0 && (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-500">
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
