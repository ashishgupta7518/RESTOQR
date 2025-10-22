// AdminAnalytics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/admin/restaurant-stats`, {
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
        return <div className="p-8 text-center text-gray-500 text-lg">Loading dashboard...</div>;

    return (
        <div className="p-10 bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                📊 Restaurant Admin Dashboard
            </h2>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg p-6 rounded-3xl text-center text-white transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-80">Total Restaurants</h3>
                    <p className="text-4xl font-extrabold mt-2">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg p-6 rounded-3xl text-center text-white transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-80">New This Week</h3>
                    <p className="text-4xl font-extrabold mt-2">{stats.weekly}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg p-6 rounded-3xl text-center text-white transform hover:scale-105 transition-transform">
                    <h3 className="text-lg font-medium opacity-80">New This Month</h3>
                    <p className="text-4xl font-extrabold mt-2">{stats.monthly}</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white shadow-2xl p-6 rounded-3xl">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                    📅 Registrations (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#fef3c7", borderRadius: "8px" }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#F97316"
                            radius={[10, 10, 0, 0]}
                            barSize={20}
                            animationDuration={800}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminAnalytics;
