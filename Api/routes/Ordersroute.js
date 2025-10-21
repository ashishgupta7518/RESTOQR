import express from "express";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// ✅ Create new order
router.post("/restaurant", async (req, res) => {
  try {
    const { restaurantId, customer, items, totalPrice, status } = req.body;

    // Validate restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // ✅ Generate unique orderId
    const orderId = uuidv4();

    // Create order with restaurantName and orderId
    const order = new Order({
      restaurantId,
      restaurantName: restaurant.name, // Track restaurant name
      customer,
      items,
      totalPrice,
      status: status || "pending",
      orderId, // <-- added
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ Get all orders for a specific restaurant
router.get("/restaurant/:id", async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Update order status (pending → served)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});




router.get("/notifications/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Fetch all orders for this restaurant, sorted by newest first
    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });

    // Map into notification format
    const notifications = orders.map((order) => ({
      orderId: order.orderId,
      customerName: order.customer.name,
      customerMobile: order.customer.mobile,
      table: order.customer.table,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        total: i.total,
      })),
      totalPrice: order.totalPrice,
      status: order.status,
      orderTime: order.createdAt,
    }));

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

export default router;
