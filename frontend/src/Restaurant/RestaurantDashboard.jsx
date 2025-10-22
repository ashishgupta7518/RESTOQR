import { useState, useEffect, useRef } from "react";
import RestaurantMenu from "./Dashboard";
import RestaurantProfile from "./RestaurantProfile";
import ResetPassword from "./ResetPassword";
import RestaurantOrders from "./RestaurantOrders";
import NotificationsPanel from "./NotificationsPanel";
import OrderCleanup from "./OrderCleanup";
import axios from "axios";
import API_BASE_URL from "../config";

// ✅ Lucide icons
import {
    LogOut,
    UserCircle,
    ClipboardList,
    Settings,
    HelpCircle,
    Lock,
    ShoppingCart,
    Bell,
    Trash2,
} from "lucide-react";

const RestaurantDashboard = () => {
    const [activeSection, setActiveSection] = useState("profile");
    const [pendingCount, setPendingCount] = useState(0);
    const previousCount = useRef(0);
    const restaurantId = localStorage.getItem("userId");

    // Fetch pending orders count
    const fetchPendingCount = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/order/restaurant/${restaurantId}`);
            const pending = data.filter((order) => order.status === "pending").length;

            if (pending > previousCount.current) {
                const notificationSound = new Audio("/mixkit-bell-notification-933.wav");
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
        const interval = setInterval(fetchPendingCount, 5000);
        return () => clearInterval(interval);
    }, [restaurantId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.clear();
        window.location.href = "/login";
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
                return (
                    <div className="p-6">
                        <ResetPassword />
                    </div>
                );
            case "orders":
                return (
                    <div className="p-6">
                        <RestaurantOrders restaurantId={restaurantId} />
                    </div>
                );
            case "Notification":
                return (
                    <div className="p-6">
                        <NotificationsPanel restaurantId={restaurantId} />
                    </div>
                );
            case "delete-order":
                return (
                    <div className="p-6">
                        <OrderCleanup restaurantId={restaurantId} />
                    </div>
                );
            default:
                return <RestaurantProfile />;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col justify-between p-6 fixed h-full shadow-xl">
                <div>
                    <h2 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
                        🍴 Restaurant Panel
                    </h2>

                    <ul className="space-y-3">
                        <SidebarItem
                            icon={<UserCircle size={20} />}
                            label="Create Restaurant Profile"
                            active={activeSection === "profile"}
                            onClick={() => setActiveSection("profile")}
                        />
                        <SidebarItem
                            icon={<ClipboardList size={20} />}
                            label="Create Menu"
                            active={activeSection === "menu"}
                            onClick={() => setActiveSection("menu")}
                        />
                        <SidebarItem
                            icon={<Settings size={20} />}
                            label="Settings"
                            active={activeSection === "settings"}
                            onClick={() => setActiveSection("settings")}
                        />
                        <SidebarItem
                            icon={<HelpCircle size={20} />}
                            label="Help"
                            active={activeSection === "help"}
                            onClick={() => setActiveSection("help")}
                        />
                        <SidebarItem
                            icon={<Lock size={20} />}
                            label="Reset Password"
                            active={activeSection === "change-password"}
                            onClick={() => setActiveSection("change-password")}
                        />
                        <SidebarItem
                            icon={<ShoppingCart size={20} />}
                            label="Orders"
                            active={activeSection === "orders"}
                            onClick={() => setActiveSection("orders")}
                        />
                        <SidebarItem
                            icon={<Bell size={20} />}
                            label="Notifications"
                            active={activeSection === "Notification"}
                            onClick={() => setActiveSection("Notification")}
                            badge={pendingCount}
                        />
                        <SidebarItem
                            icon={<Trash2 size={20} />}
                            label="Delete Order"
                            active={activeSection === "delete-order"}
                            onClick={() => setActiveSection("delete-order")}
                        />
                    </ul>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-700 pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 rounded-lg cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 bg-gray-50 p-8 overflow-y-auto">{renderContent()}</div>
        </div>
    );
};

// ✅ Reusable Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick, badge }) => (
    <li
        onClick={onClick}
        className={`relative cursor-pointer p-3 rounded-lg flex items-center gap-3 transition-colors hover:bg-gray-700 ${active ? "bg-gray-700" : ""
            }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
        {badge > 0 && (
            <span className="absolute top-2 right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {badge}
            </span>
        )}
    </li>
);

export default RestaurantDashboard;
