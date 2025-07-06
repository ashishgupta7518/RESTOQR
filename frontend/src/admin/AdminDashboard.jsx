import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { LogOut, Eye, Edit, Trash2 } from "lucide-react";


const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

const filteredRestaurants = restaurants.filter((r) =>
  (r.name?.toLowerCase().includes(search.toLowerCase()) ||
   r.email?.toLowerCase().includes(search.toLowerCase()))
);


  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
};

  return (
    <div className="min-h-screen bg-white p-6 text-sm">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          🍴 Restaurant Admin Dashboard
        </h2>

        
        <button onClick={handleLogout} className="flex items-center gap-2 border px-4 py-1.5 rounded hover:bg-gray-100">
          <LogOut className="w-4 h-4" /> Logout
        </button>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded p-4 shadow">
          <p className="text-gray-500 text-xs">Total Restaurants</p>
          <p className="text-2xl font-semibold">{restaurants.length}</p>
        </div>
        <div className="bg-gray-50 rounded p-4 shadow">
          <p className="text-gray-500 text-xs">Active Today</p>
          <p className="text-2xl font-semibold">189</p>
        </div>
        <div className="bg-gray-50 rounded p-4 shadow">
          <p className="text-gray-500 text-xs">New This Month</p>
          <p className="text-2xl font-semibold">23</p>
        </div>
        <div className="bg-gray-50 rounded p-4 shadow">
          <p className="text-gray-500 text-xs">Pending Approval</p>
          <p className="text-2xl font-semibold">8</p>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Registered Restaurants</h3>
          <input
            type="text"
            placeholder="Search restaurants..."
            className="border text-sm px-2 py-1 rounded"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-2">Restaurant</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-gray-500">ID: #{r._id?.slice(-4)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">123 Main St</div>
                    <div className="text-xs text-gray-500">City, State</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{r.email}</div>
                    <div className="text-xs text-gray-500">+1 (555) 000-0000</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <QRCodeCanvas value={`https://yourapp.com/restaurant/${r._id}`} size={64} />

                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-gray-600 hover:text-blue-600"><Eye size={16} /></button>
                    <button className="text-gray-600 hover:text-yellow-600"><Edit size={16} /></button>
                    <button className="text-gray-600 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex justify-between items-center border-t text-sm">
          <span>Showing {restaurants.length > 0 ? `1 to ${restaurants.length}` : 0} of {restaurants.length} results</span>
          <div className="space-x-1">
            <button className="border px-2 py-1 rounded hover:bg-gray-100">Previous</button>
            <button className="border px-2 py-1 rounded bg-gray-900 text-white">1</button>
            <button className="border px-2 py-1 rounded hover:bg-gray-100">2</button>
            <button className="border px-2 py-1 rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
