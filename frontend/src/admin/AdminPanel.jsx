import { useState } from "react";
import { LogOut } from "lucide-react";

import API_BASE_URL from "../config";
import AdminDashboard from "./AdminDashboard";
import AdminAnalytics from "./AdminAnalytics";

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState("dashboard");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };

    const renderContent = () => {
        switch (activeSection) {
            case "AdminAnalytics":
                return <AdminAnalytics />;
            case "All-Restaurant":
                return <AdminDashboard />;
            case "settings":
                return <div className="p-6 text-gray-700">⚙️ Settings Section Coming Soon...</div>;
            default:
                return <div className="p-6 text-gray-700">📊 Admin Dashboard Coming Soon...</div>;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col justify-between p-6 fixed h-full">
                <div>
                    <h2 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
                        Super Admin
                    </h2>

                    <ul className="space-y-3">
                        <li
                            onClick={() => setActiveSection("AdminAnalytics")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "AdminAnalytics" ? "bg-gray-700" : ""
                                }`}
                        >
                            📊 <span>AdminAnalytics</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("All-Restaurant")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "All-Restaurant" ? "bg-gray-700" : ""
                                }`}
                        >
                            <span>All Restaurant</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("settings")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "settings" ? "bg-gray-700" : ""
                                }`}
                        >
                            ⚙️ <span>Settings</span>
                        </li>
                    </ul>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-700 pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 rounded-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 bg-gray-50 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;
