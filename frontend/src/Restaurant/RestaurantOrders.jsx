import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, Loader2, Download } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import API_BASE_URL from "../config";

const RestaurantOrders = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all orders for the restaurant
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `${API_BASE_URL}/order/restaurant/${restaurantId}`
                );
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                toast.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [restaurantId]);

    //  Download PDF receipt for specific order
    const handleDownloadReceipt = async (orderId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/order/${restaurantId}/receipt/${orderId}`,
                { responseType: "blob" }
            );

            // Create file download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Receipt_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Receipt downloaded!");
        } catch (error) {
            console.error("Error downloading receipt:", error);
            toast.error("Failed to download receipt.");
        }
    };

    //  Mark an order as served
    const markAsServed = async (orderId) => {
        try {
            await axios.patch(`${API_BASE_URL}/order/${orderId}/status`, {
                status: "served",
            });
            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? { ...o, status: "served" } : o))
            );
            toast.success("Order marked as served!");
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Failed to update order status.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Loading orders...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-6xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold mb-10 text-center text-gray-800"
                >
                    🍽️ Restaurant Orders
                </motion.h1>

                {orders.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 text-lg"
                    >
                        No orders yet.
                    </motion.p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className="relative bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {order.customer?.name || "Guest"} — Table{" "}
                                                {order.customer?.table || "-"}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                📞 {order.customer?.mobile}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${order.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {order.status === "pending" ? (
                                                <>
                                                    <Clock className="w-4 h-4" /> Pending
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" /> Served
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        Order ID:{" "}
                                        <span className="font-mono text-gray-800">
                                            {order._id}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                                        <ul className="text-gray-700 space-y-1">
                                            {order.items.map((item) => (
                                                <li
                                                    key={item._id}
                                                    className="flex justify-between border-b border-gray-100 pb-1 text-sm"
                                                >
                                                    <span>
                                                        {item.name} × {item.quantity}
                                                    </span>
                                                    <span className="font-medium">₹{item.total}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className="text-lg font-bold text-gray-800">
                                            Total: ₹{order.totalPrice}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {order.status === "pending" && (
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => markAsServed(order._id)}
                                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md transition cursor-pointer"
                                                >
                                                    Mark as Served
                                                </motion.button>
                                            )}

                                            {/* ✅ Download Receipt Button */}
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => handleDownloadReceipt(order._id)}
                                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-2 rounded-xl font-semibold text-sm shadow-md flex items-center gap-2 transition cursor-pointer"
                                            >
                                                <Download className="w-4 h-4" />
                                                Receipt
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrders;
