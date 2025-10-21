import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import API_BASE_URL from "../config";

const RestaurantOrders = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch all orders for restaurant
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `${API_BASE_URL}/order/restaurant/${restaurantId}`
                );
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [restaurantId]);

    // ✅ Update order status to served
    const markAsServed = async (orderId) => {
        try {
            await axios.patch(`${API_BASE_URL}/order/${orderId}/status`, {
                status: "served",
            });
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId ? { ...o, status: "served" } : o
                )
            );
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update order status.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                <Loader2 className="animate-spin mr-2" /> Loading orders...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                🍽️ Orders for Your Restaurant
            </h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders yet.</p>
            ) : (
                <div className="grid gap-6 max-w-5xl mx-auto">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {order.customer?.name} — Table {order.customer?.table}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {order.customer?.mobile}
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {order.status === "pending" ? (
                                        <>
                                            <Clock className="inline w-4 h-4 mr-1" /> Pending
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="inline w-4 h-4 mr-1" /> Served
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="mb-4 text-sm text-gray-500">
                                Order ID: <span className="font-mono">{order._id}</span>
                            </div>

                            <div className="border-t border-gray-200 pt-3">
                                <h3 className="font-semibold mb-2">Items:</h3>
                                <ul className="text-gray-700 space-y-1">
                                    {order.items.map((item) => (
                                        <li
                                            key={item._id}
                                            className="flex justify-between border-b pb-1 text-sm"
                                        >
                                            <span>
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span>₹{item.total}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-lg font-bold text-gray-800">
                                    Total: ₹{order.totalPrice}
                                </span>

                                {order.status === "pending" && (
                                    <button
                                        onClick={() => markAsServed(order._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition"
                                    >
                                        Mark as Served
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantOrders;