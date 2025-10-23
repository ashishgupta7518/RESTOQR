import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Trash2, Clock, Loader2, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const OrderCleanup = ({ restaurantId }) => {
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState(30);

    const handleDeleteAll = async () => {
        const confirm = await Swal.fire({
            title: "Delete All Orders?",
            text: "This will permanently remove all orders for this restaurant!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete all",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            background: "#fef2f2",
        });

        if (!confirm.isConfirmed) return;
        setLoading(true);

        try {
            const res = await axios.delete(
                `${API_BASE_URL}/order/cleanup/restaurant/${restaurantId}`
            );
            Swal.fire({
                title: "Deleted!",
                text: res.data.message || "All orders deleted successfully.",
                icon: "success",
                confirmButtonColor: "#16a34a",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.error || "Failed to delete orders.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOld = async () => {
        if (!days || days <= 0) {
            toast.error("Please enter a valid number of days");
            return;
        }

        const confirm = await Swal.fire({
            title: "Delete Old Orders?",
            text: `Orders older than ${days} days will be permanently deleted.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, delete old orders",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280",
            background: "#eff6ff",
        });

        if (!confirm.isConfirmed) return;
        setLoading(true);

        try {
            const res = await axios.delete(
                `${API_BASE_URL}/order/cleanup/old?days=${days}`
            );
            Swal.fire({
                title: "Cleaned!",
                text: res.data.message || "Old orders deleted successfully.",
                icon: "success",
                confirmButtonColor: "#16a34a",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.error || "Failed to delete old orders.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="backdrop-blur-xl bg-white/80 shadow-xl border border-gray-200 rounded-2xl p-8 w-full max-w-3xl"
            >
                {/* Header */}
                <div className="flex flex-col items-center justify-center gap-3 mb-6 text-center">
                    <motion.div
                        initial={{ rotate: -20 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <ShieldCheck className="w-10 h-10 text-blue-600 drop-shadow" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Order Cleanup Panel
                    </h2>
                    <p className="text-gray-500 max-w-md">
                        Manage and clear your restaurant’s old or unused order data safely and easily.
                    </p>
                </div>

                {/* Action Cards */}
                <div className="space-y-8">
                    {/* Delete All Orders */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl bg-gradient-to-r from-red-50 via-red-100 to-rose-50 border border-red-200 shadow-md flex flex-col md:flex-row items-center justify-between transition"
                    >
                        <div className="flex items-center gap-4 mb-3 md:mb-0">
                            <Trash2 className="text-red-600 w-8 h-8" />
                            <div>
                                <h3 className="text-xl font-semibold text-red-700">
                                    Delete All Orders
                                </h3>
                                <p className="text-sm text-red-500">
                                    Permanently remove every order for this restaurant.
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDeleteAll}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm font-medium transition disabled:opacity-70 cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                            Delete All
                        </motion.button>
                    </motion.div>

                    {/* Delete Old Orders */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-100 to-indigo-50 border border-blue-200 shadow-md flex flex-col md:flex-row items-center justify-between transition"
                    >
                        <div className="flex items-center gap-4 mb-3 md:mb-0">
                            <Clock className="text-blue-600 w-8 h-8" />
                            <div>
                                <h3 className="text-xl font-semibold text-blue-700">
                                    Delete Old Orders
                                </h3>
                                <p className="text-sm text-blue-500">
                                    Clean up all orders older than the selected number of days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min="1"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 shadow-sm"
                            />
                            <span className="text-gray-600 text-sm">days</span>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDeleteOld}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm font-medium transition disabled:opacity-70 cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    <Clock className="w-5 h-5" />
                                )}
                                Delete Old
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderCleanup;
