// CreateAdmin.jsx
import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast } from "react-hot-toast";
import { Loader2, UserPlus } from "lucide-react";

const API_URL = `${API_BASE_URL}/admin/create-admin`;

const CreateAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error("Please fill all fields");

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                API_URL,
                { email, password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);
            setEmail("");
            setPassword("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex  items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-8">
            <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl border border-gray-200 relative overflow-hidden">
                {/* Decorative image */}
                <img
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
                    alt="restaurant decor"
                    className="absolute top-0 right-0 h-full w-1/2 object-cover rounded-tr-3xl rounded-br-3xl opacity-20 pointer-events-none"
                />

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-4">
                        <UserPlus className="w-8 h-8 text-orange-500" />
                        <h2 className="text-3xl font-bold text-gray-800">Create Admin</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label className="text-lg font-medium text-gray-700 mb-2">Admin Email</label>
                            <input
                                type="email"
                                placeholder="Enter admin email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-lg font-medium text-gray-700 mb-2">Admin Password</label>
                            <input
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all text-lg"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="animate-spin mr-3 h-5 w-5" />}
                            {loading ? "Creating..." : "Create Admin"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAdmin;
