// CreateAdmin.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // same toast library as previous UI
import { Loader2 } from "lucide-react"; // loading icon

const API_URL = "http://localhost:5000/api/admin/create-admin";

const CreateAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token"); // Superadmin JWT

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
        <div className="p-6 bg-white rounded shadow max-w-md mx-auto mt-6">
            <h2 className="text-xl font-bold mb-4">Create Admin</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
                    disabled={loading}
                >
                    {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Create Admin
                </button>
            </form>
        </div>
    );
};

export default CreateAdmin;
