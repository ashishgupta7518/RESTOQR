import { useState } from "react";
import RestaurantMenu from "./Dashboard";
import RestaurantProfile from "./RestaurantProfile";
import { LogOut } from "lucide-react";

const RestaurantDashboard = () => {
    const [activeSection, setActiveSection] = useState("profile"); // default: profile

    const handleLogout = () => {
        // Clear token or session
        localStorage.removeItem("token");
        sessionStorage.clear();
        window.location.href = "/login"; // redirect to login page
    };

    const renderContent = () => {
        switch (activeSection) {
            case "profile":
                return <RestaurantProfile />;
            case "menu":
                return <RestaurantMenu />;
            case "settings":
                return <div className="p-6">⚙️ Settings Section Coming Soon...</div>;
            case "help":
                return <div className="p-6">📞 Help Section Coming Soon...</div>;
            default:
                return <RestaurantProfile />;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col justify-between p-6 fixed h-full">
                <div>
                    <h2 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
                        Restaurant Panel
                    </h2>

                    <ul className="space-y-3">
                        <li
                            onClick={() => setActiveSection("profile")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "profile" ? "bg-gray-700" : ""
                                }`}
                        >
                            🍽️ <span>Create Restaurant Profile</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("menu")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "menu" ? "bg-gray-700" : ""
                                }`}
                        >
                            📜 <span>Create Menu</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("settings")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "settings" ? "bg-gray-700" : ""
                                }`}
                        >
                            ⚙️ <span>Settings</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("help")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "help" ? "bg-gray-700" : ""
                                }`}
                        >
                            💬 <span>Help</span>
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

            {/* Main Content Area */}
            <div className="ml-64 flex-1 bg-gray-50 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default RestaurantDashboard;
    