import { useState, useEffect, useRef } from "react";
import RestaurantMenu from "./Dashboard";
import RestaurantProfile from "./RestaurantProfile";
import { LogOut } from "lucide-react";
import ResetPassword from "./ResetPassword";
import RestaurantOrders from "./RestaurantOrders";
import NotificationsPanel from "./NotificationsPanel";
import axios from "axios";
import API_BASE_URL from "./../config";

const RestaurantDashboard = () => {
    const [activeSection, setActiveSection] = useState("profile"); // default: profile
    const [pendingCount, setPendingCount] = useState(0);
    const previousCount = useRef(0); // track previous pending count

    const restaurantId = localStorage.getItem("userId");

    // Fetch pending orders count
    const fetchPendingCount = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/order/restaurant/${restaurantId}`);
            const pending = data.filter(order => order.status === "pending").length;

            // Play notification sound if new order comes
            if (pending > previousCount.current) {
                const notificationSound = new Audio("/mixkit-bell-notification-933.wav"); // put notification.mp3 in public folder
                notificationSound.play();
            }

            previousCount.current = pending;
            setPendingCount(pending);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    useEffect(() => {
        fetchPendingCount();

        // Poll every 5 seconds for updates
        const interval = setInterval(fetchPendingCount, 5000);
        return () => clearInterval(interval);
    }, [restaurantId]);

    const handleLogout = () => {
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
            case "change-password":
                return <div className="p-6"><ResetPassword /></div>;
            case "orders":
                return <div className="p-6"><RestaurantOrders restaurantId={restaurantId} /></div>;
            case "Notification":
                return <div className="p-6"><NotificationsPanel restaurantId={restaurantId} /></div>;
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
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "profile" ? "bg-gray-700" : ""}`}
                        >
                            🍽️ <span>Create Restaurant Profile</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("menu")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "menu" ? "bg-gray-700" : ""}`}
                        >
                            📜 <span>Create Menu</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("settings")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "settings" ? "bg-gray-700" : ""}`}
                        >
                            ⚙️ <span>Settings</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("help")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "help" ? "bg-gray-700" : ""}`}
                        >
                            💬 <span>Help</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("change-password")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "change-password" ? "bg-gray-700" : ""}`}
                        >
                            🔒 <span>Reset password</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("orders")}
                            className={`cursor-pointer p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "orders" ? "bg-gray-700" : ""}`}
                        >
                            🛒 <span>Orders</span>
                        </li>

                        <li
                            onClick={() => setActiveSection("Notification")}
                            className={` cursor-pointer relative p-3 rounded-lg transition-colors flex items-center gap-2 hover:bg-gray-700 ${activeSection === "Notification" ? "bg-gray-700" : ""}`}
                        >
                            🔔 <span>Notification</span>
                            {pendingCount > 0 && (
                                <span className="absolute top-1 right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {pendingCount}
                                </span>
                            )}
                        </li>
                    </ul>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-700 pt-4">
                    <button
                        onClick={handleLogout}
                        className=" cursor-pointer w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 rounded-lg"
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
