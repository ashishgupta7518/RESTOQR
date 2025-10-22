import { useState } from "react";
import {
    LayoutDashboard,
    BarChart3,
    Settings,
    UserPlus,
    Trash2,
    LogOut,
    Store,
} from "lucide-react";
import API_BASE_URL from "../config";
import AdminDashboard from "./AdminDashboard";
import AdminAnalytics from "./AdminAnalytics";
import CreateAdmin from "./CreateAdmin";
import DeleteRestaurant from "./DeleteRestaurant";

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
                return (
                    <div className="p-6 text-gray-700">
                        ⚙️ Settings Section Coming Soon...
                    </div>
                );
            case "create-admin":
                return <CreateAdmin />;
            case "delete-resto":
                return <DeleteRestaurant />;
            default:
                return <AdminAnalytics />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between p-6 fixed h-full shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4 tracking-wide">
                        Super Admin
                    </h2>

                    <ul className="space-y-3">
                        <li
                            onClick={() => setActiveSection("AdminAnalytics")}
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center gap-3 hover:bg-gray-700 hover:translate-x-1 ${activeSection === "AdminAnalytics" ? "bg-gray-700" : ""
                                }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span>Analytics</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("All-Restaurant")}
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center gap-3 hover:bg-gray-700 hover:translate-x-1 ${activeSection === "All-Restaurant" ? "bg-gray-700" : ""
                                }`}
                        >
                            <Store className="w-5 h-5" />
                            <span>All Restaurants</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("create-admin")}
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center gap-3 hover:bg-gray-700 hover:translate-x-1 ${activeSection === "create-admin" ? "bg-gray-700" : ""
                                }`}
                        >
                            <UserPlus className="w-5 h-5" />
                            <span>Create Admin</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("delete-resto")}
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center gap-3 hover:bg-gray-700 hover:translate-x-1 ${activeSection === "delete-resto" ? "bg-gray-700" : ""
                                }`}
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete Restaurant</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("settings")}
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center gap-3 hover:bg-gray-700 hover:translate-x-1 ${activeSection === "settings" ? "bg-gray-700" : ""
                                }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </li>
                    </ul>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-700 pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-2 rounded-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 overflow-y-auto bg-white shadow-inner rounded-lg">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPanel;
