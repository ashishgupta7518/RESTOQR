import { useState } from "react";

import RestaurantMenu from "./Dashboard";
import RestaurantProfile from "./RestaurantProfile";

const RestaurantDashboard = () => {
    const [activeSection, setActiveSection] = useState("profile"); // default: profile

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
            <div className="w-64 bg-gray-900 text-white flex flex-col p-6 fixed h-full">
                <h2 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
                    Restaurant Panel
                </h2>

                <ul className="space-y-4">
                    <li
                        onClick={() => setActiveSection("profile")}
                        className={`cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "profile" ? "bg-gray-700" : ""
                            }`}
                    >
                        🍽️ Create Restaurant Profile
                    </li>

                    <li
                        onClick={() => setActiveSection("menu")}
                        className={`cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "menu" ? "bg-gray-700" : ""
                            }`}
                    >
                        📜 Create Menu
                    </li>

                    <li
                        onClick={() => setActiveSection("settings")}
                        className={`cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "settings" ? "bg-gray-700" : ""
                            }`}
                    >
                        ⚙️ Settings
                    </li>

                    <li
                        onClick={() => setActiveSection("help")}
                        className={`cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "help" ? "bg-gray-700" : ""
                            }`}
                    >
                        💬 Help
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="ml-64 flex-1 bg-gray-50 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default RestaurantDashboard;
