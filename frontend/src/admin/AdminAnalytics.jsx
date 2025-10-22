import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:5000/api/admin/restaurant-stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats)
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">📊 Admin Dashboard Overview</h2>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-md p-6 rounded-2xl text-center">
                    <h3 className="text-gray-500 font-medium">Total Restaurants</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white shadow-md p-6 rounded-2xl text-center">
                    <h3 className="text-gray-500 font-medium">New This Week</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.weekly}</p>
                </div>
                <div className="bg-white shadow-md p-6 rounded-2xl text-center">
                    <h3 className="text-gray-500 font-medium">New This Month</h3>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.monthly}</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white shadow-md p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">📅 Registrations (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminAnalytics;
