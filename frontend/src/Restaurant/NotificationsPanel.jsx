import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, Download } from "lucide-react";
import API_BASE_URL from "../config";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const NotificationsPanel = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    const downloadOrderItem = async () => {

        try {
            const token = localStorage.getItem("token");
            if (!token) return toast.error("Unauthorized — please login again");

            const response = await axios.get(
                `http://localhost:5000/api/admin/download-orders/${restaurantId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob", // Important for file downloads
                }
            );

            // Create a download link dynamically
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `orders_${restaurantId}.csv`); // adjust file type if PDF
            document.body.appendChild(link);
            link.click();

            toast.success("Orders downloaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to download orders");
        }

    }
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/order/notifications/${restaurantId}`
            );
            setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching orders:", err);
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

        // Filter by status
        if (statusFilter !== "All") {
            if (statusFilter === "approved") {
                result = result.filter(
                    (o) => o.status === "approved" || o.status === "served"
                );
            } else {
                result = result.filter((o) => o.status === statusFilter);
            }
        }

        // Filter by search term
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">📦 Live Orders Dashboard</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Orders" value={stats.total} />
                <StatCard title="Pending Orders" value={stats.pending} color="yellow" />
                <StatCard title="Approved Orders" value={stats.approved} color="green" />
                <StatCard title="Rejected Orders" value={stats.rejected} color="red" />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    {["All", "pending", "approved", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleFilter(s)}
                            className={`px-4 py-2 text-sm rounded-lg border transition-all cursor-pointer ${statusFilter === s
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
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
                            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>

                    <button onClick={downloadOrderItem} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
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
                                <td colSpan="7" className="text-center py-6 text-gray-500 font-medium">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((order, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    const colorMap = {
        yellow: "text-yellow-600 bg-yellow-50",
        green: "text-green-600 bg-green-50",
        red: "text-red-600 bg-red-50",
    };

    return (
        <div
            className={`rounded-xl shadow-sm border border-gray-200 p-5 bg-white flex flex-col justify-center items-start ${colorMap[color] || ""
                }`}
        >
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
    );
};

export default NotificationsPanel;
