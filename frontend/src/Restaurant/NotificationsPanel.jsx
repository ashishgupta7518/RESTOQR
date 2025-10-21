import { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import API_BASE_URL from "./../config"; // make sure this is correct

const NotificationsPanel = ({ restaurantId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/order/notifications/${restaurantId}`
            );
            setNotifications(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll every 5 seconds for new orders
        const interval = setInterval(fetchNotifications, 5000);

        return () => clearInterval(interval); // cleanup
    }, [restaurantId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-6">
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-yellow-500" /> Live Order Notifications
            </h2>

            {notifications.length === 0 && (
                <p className="text-gray-500">No orders yet.</p>
            )}

            <div className="flex flex-col gap-4">
                {notifications.map((order) => (
                    <div
                        key={order.orderId || order._id}
                        className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                        <div>
                            <p className="font-semibold text-gray-800">
                                {order.customerName} (Table: {order.table})
                            </p>
                            <p className="text-gray-500 text-sm">{order.customerMobile}</p>
                        </div>

                        <div className="flex-1">
                            <ul className="list-disc list-inside text-gray-700">
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} x{item.quantity} — ₹{item.total}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-right md:text-left">
                            <p className="font-semibold text-gray-800">
                                Total: ₹{order.totalPrice}
                            </p>
                            <p
                                className={`text-sm mt-1 ${order.status === "pending"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                                    }`}
                            >
                                {order.status.toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(order.orderTime).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPanel;
