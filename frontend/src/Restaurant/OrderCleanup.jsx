import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Trash2, Clock, Loader2, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

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
            const res = await axios.delete(`${API_BASE_URL}/order/cleanup/restaurant/${restaurantId}`);
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
            const res = await axios.delete(`${API_BASE_URL}/order/cleanup/old?days=${days}`);
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
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Toaster position="top-right" />
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-gray-200">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                    <h2 className="text-2xl font-semibold text-gray-800">Order Cleanup Panel</h2>
                </div>

                <p className="text-center text-gray-500 mb-8">
                    Manage and clear restaurant orders easily. Choose whether to delete all orders or clean up older data.
                </p>

                <div className="space-y-8">
                    {/* Delete All Orders */}
                    <div className="p-5 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 shadow-sm flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                            <Trash2 className="text-red-600 w-6 h-6" />
                            <div>
                                <h3 className="text-lg font-medium text-red-700">Delete All Orders</h3>
                                <p className="text-sm text-red-500">Remove every order for this restaurant permanently.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDeleteAll}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition disabled:opacity-70 cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                            Delete All
                        </button>
                    </div>

                    {/* Delete Old Orders */}
                    <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                            <Clock className="text-blue-600 w-6 h-6" />
                            <div>
                                <h3 className="text-lg font-medium text-blue-700">Delete Old Orders</h3>
                                <p className="text-sm text-blue-500">Clean up orders older than the selected number of days.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min="1"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                            <span className="text-gray-600 text-sm">days</span>
                            <button
                                onClick={handleDeleteOld}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition disabled:opacity-70 cursor-pointer"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                Delete Old
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCleanup;
