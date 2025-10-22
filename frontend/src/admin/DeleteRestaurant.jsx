import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast } from "react-hot-toast";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

const AdminDeleteRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // store restaurant id for confirmation

  const token = localStorage.getItem("token");

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/restaurant-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/admin/delete-restaurant/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Restaurant deleted successfully!");
      setRestaurants(restaurants.filter((r) => r._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete restaurant");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading restaurants...
      </div>
    );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        🏨 Manage Restaurants
      </h2>

      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No restaurants found.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-xl bg-white">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b text-gray-700">
                <th className="p-4 text-left font-medium">Restaurant Name</th>
                <th className="p-4 text-left font-medium">Restaurant ID</th>
                <th className="p-4 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r, i) => (
                <tr
                  key={r._id}
                  className="hover:bg-gray-50 border-b transition-all"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {r.name || "Unnamed Restaurant"}
                  </td>
                  <td className="p-4 text-gray-600">{r._id}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setDeleteId(r._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center mx-auto transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🧠 Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this restaurant from
              the database? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeleteRestaurant;
