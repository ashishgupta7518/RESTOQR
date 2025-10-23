import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast, Toaster } from "react-hot-toast";
import { Loader2, UserMinus, Trash2, ShieldAlert } from "lucide-react";

const DeleteAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const token = localStorage.getItem("token");

    // Fetch all admins
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/admin/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAdmins(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch admins");
            }
        };
        fetchAdmins();
    }, [token]);

    // Handle delete admin
    const handleDelete = async () => {
        if (!selectedAdmin) return toast.error("Please select an admin to delete");

        setLoading(true);
        try {
            const res = await axios.delete(`${API_BASE_URL}/admin/delete-admin/${selectedAdmin}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(res.data.message);
            setAdmins(admins.filter((a) => a._id !== selectedAdmin));
            setSelectedAdmin("");
            setShowConfirm(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-rose-50 to-pink-100 p-6">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-2xl border border-gray-200 relative">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2920/2920345.png"
                            alt="Admin Logo"
                            className="w-12 h-12"
                        />
                        <h2 className="text-3xl font-bold text-gray-800">Admin Management</h2>
                    </div>
                </div>

                <div className="border-b border-gray-200 mb-6"></div>

                {/* Form */}
                <div className="flex flex-col gap-5">
                    <label className="text-lg font-medium text-gray-700">Select Admin to Delete</label>
                    <select
                        value={selectedAdmin}
                        onChange={(e) => setSelectedAdmin(e.target.value)}
                        className="border border-gray-300 rounded-xl p-4 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-red-200"
                    >
                        <option value="">-- Choose an Admin --</option>
                        {admins.map((admin) => (
                            <option key={admin._id} value={admin._id}>
                                {admin.email}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            if (!selectedAdmin) return toast.error("Please select an admin");
                            setShowConfirm(true);
                        }}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center transition-all text-lg shadow-md disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-3 h-5 w-5" /> Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-5 h-5 mr-2" /> Delete Admin
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center border border-gray-200 animate-fadeIn">
                        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to permanently delete this admin account?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all cursor-pointer"
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

export default DeleteAdmin;
