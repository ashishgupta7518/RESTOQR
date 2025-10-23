import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, Download } from "lucide-react";
import API_BASE_URL from "../config";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const NotificationsPanel = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/order/notifications/${restaurantId}`
            );
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [restaurantId]);

    useEffect(() => {
        let result = [...orders];
        if (statusFilter !== "All") {
            if (statusFilter === "approved") {
                result = result.filter(
                    (o) => o.status === "approved" || o.status === "served"
                );
            } else {
                result = result.filter((o) => o.status === statusFilter);
            }
        }
        if (search.trim() !== "") {
            const value = search.toLowerCase();
            result = result.filter(
                (o) =>
                    o.customerName?.toLowerCase().includes(value) ||
                    o._id?.toLowerCase().includes(value) ||
                    o.customerMobile?.includes(value)
            );
        }
        setFiltered(result);
    }, [orders, statusFilter, search]);

    const handleFilter = (status) => setStatusFilter(status);
    const handleSearch = (e) => setSearch(e.target.value);

    const downloadOrderItem = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return toast.error("Unauthorized — please login again");

            const response = await axios.get(
                `${API_BASE_URL}/admin/download-orders/${restaurantId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `orders_${restaurantId}.csv`);
            document.body.appendChild(link);
            link.click();

            toast.success("Orders downloaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to download orders");
        }
    };

    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        approved: orders.filter(
            (o) => o.status === "approved" || o.status === "served"
        ).length,
        rejected: orders.filter((o) => o.status === "rejected").length,
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64 text-gray-600 font-medium">
                Loading live orders...
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-8"
            >
                <h2 className="text-3xl font-bold text-gray-800">
                    📦 Live Orders Dashboard
                </h2>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                <StatCard title="Total Orders" value={stats.total} color="blue" />
                <StatCard title="Pending Orders" value={stats.pending} color="yellow" />
                <StatCard title="Approved Orders" value={stats.approved} color="green" />
                <StatCard title="Rejected Orders" value={stats.rejected} color="red" />
            </motion.div>

            {/* Filters & Search */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    {["All", "pending", "approved", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleFilter(s)}
                            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 shadow-sm cursor-pointer ${statusFilter === s
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, phone..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                        />
                    </div>

                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-gray-100 transition">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={downloadOrderItem}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </motion.button>
                </div>
            </div>

            {/* Orders Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
                <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Phone</th>
                            <th className="px-6 py-3">Items</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500 font-medium"
                                >
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((order, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-gray-100 hover:bg-indigo-50/50 transition-all"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        #{order._id?.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">{order.customerName}</td>
                                    <td className="px-6 py-4">{order.customerMobile}</td>
                                    <td className="px-6 py-4">
                                        {order.items
                                            .map((item) => `${item.name} x${item.quantity}`)
                                            .slice(0, 2)
                                            .join(", ")}
                                        {order.items.length > 2 && (
                                            <span className="text-gray-400">
                                                {" "}
                                                +{order.items.length - 2} more
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-semibold">
                                        ₹{order.totalPrice}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "approved" ||
                                                        order.status === "served"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {order.status?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(order.orderTime).toLocaleDateString()}{" "}
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.orderTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    const colors = {
        blue: "from-indigo-500 to-purple-500 text-white",
        yellow: "from-yellow-400 to-amber-500 text-white",
        green: "from-green-500 to-emerald-600 text-white",
        red: "from-red-500 to-pink-500 text-white",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${colors[color]} rounded-2xl shadow-md p-5 text-left`}
        >
            <p className="text-sm opacity-80 font-medium">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </motion.div>
    );
};

export default NotificationsPanel;
