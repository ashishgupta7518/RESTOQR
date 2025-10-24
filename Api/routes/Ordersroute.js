import express from "express";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create new order
router.post("/restaurant", async (req, res) => {
  try {
    const { restaurantId, customer, items, totalPrice, status } = req.body;

    // Validate restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Generate unique orderId
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

// Get all orders for a specific restaurant
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


// Generate PDF Receipt for a specific order & restaurant
router.get("/:restaurantId/receipt/:orderId", async (req, res) => {
  try {
    const { restaurantId, orderId } = req.params;

    // Fetch all orders for that restaurant
    const { data: orders } = await axios.get(
      `https://restoqr-api.onrender.com/api/order/restaurant/${restaurantId}`
    );

    const order = orders.find(
      (o) => o._id === orderId || o.orderId === orderId
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const filePath = path.join(__dirname, `receipt_${orderId}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Fonts & styling
    doc.font("Helvetica"); // default sans-serif
    doc.fontSize(20).fillColor("#333").text(`🍽️ ${order.restaurantName || "Restaurant"}`, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(16).text("Restaurant Order Receipt", { align: "center" });
    doc.moveDown(1);

    // Customer Info
    doc.fontSize(12).fillColor("#000");
    doc.text(`Customer: ${order.customer?.name || "N/A"}`);
    doc.text(`Mobile: ${order.customer?.mobile || "N/A"}`);
    doc.text(`Table: ${order.customer?.table || "N/A"}`);
    doc.text(`Status: ${order.status || "pending"}`);
    doc.text(
      `Order Time: ${order.orderTime ? new Date(order.orderTime).toLocaleString() : new Date().toLocaleString()
      }`
    );
    doc.moveDown(1);

    // Items table header
    doc.font("Courier-Bold").text("No  Item                  Qty   Price   Total", { underline: true });
    doc.moveDown(0.5);

    // Items
    order.items?.forEach((item, index) => {
      const name = item.name.padEnd(20, " "); // fixed width for alignment
      const qty = (item.quantity || 1).toString().padStart(3, " ");
      const price = (item.price || 0).toString().padStart(6, " ");
      const total = (item.total || (item.price * item.quantity) || 0).toString().padStart(7, " ");
      doc.font("Courier").text(`${index + 1}. ${name} ${qty}  ${price}  ${total}`);
    });

    doc.moveDown(1);

    // Total
    doc.font("Helvetica-Bold").fontSize(14).text(`Total: ₹${order.totalPrice || 0}`, { align: "right" });
    doc.moveDown(2);

    // Footer
    doc.font("Helvetica-Oblique").fontSize(10).fillColor("#777");
    doc.text("Thank you for dining with us!", { align: "center" });
    doc.text("Please visit again ❤️", { align: "center" });

    doc.end();

    // Send PDF for download
    stream.on("finish", () => {
      res.download(filePath, `Receipt_${order.orderId || order._id}.pdf`, (err) => {
        if (err) console.error("Download error:", err);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("File cleanup error:", unlinkErr);
        });
      });
    });
  } catch (error) {
    console.error("Error generating receipt:", error.message);
    res.status(500).json({ message: "Failed to generate receipt" });
  }
});


// Update order status (pending → served)
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


// Delete all orders for a specific restaurant
router.delete("/cleanup/restaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Order.deleteMany({ restaurantId: id });
    res.json({
      message: `Deleted ${result.deletedCount} orders for restaurant ${id}`,
    });
  } catch (err) {
    console.error("Error deleting orders:", err);
    res.status(500).json({ error: "Failed to delete orders" });
  }
});


// Optional: Delete old orders (e.g., older than 30 days)
router.delete("/cleanup/old", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30; // default 30 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Order.deleteMany({ createdAt: { $lt: cutoffDate } });

    res.json({
      message: `Deleted ${result.deletedCount} old orders (older than ${days} days)`,
    });
  } catch (err) {
    console.error("Error cleaning old orders:", err);
    res.status(500).json({ error: "Failed to clean old orders" });
  }
});


export default router;
