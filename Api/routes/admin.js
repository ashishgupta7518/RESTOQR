import express from "express";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import ExcelJS from "exceljs";

const router = express.Router();

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== "admin") return res.sendStatus(403);
    next();
  });
};

router.get("/restaurants", verifyAdmin, async (req, res) => {
  const restaurants = await Restaurant.find({}, "name email menu");
  res.json(restaurants);
});



// routes/admin.js
router.get("/restaurant-stats", async (req, res) => {
  try {
    const allRestaurants = await Restaurant.find({}, "name email createdAt");

    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const total = allRestaurants.length;
    const weekly = allRestaurants.filter(r => r.createdAt >= weekAgo).length;
    const monthly = allRestaurants.filter(r => r.createdAt >= monthAgo).length;

    // Prepare 30-day trend data
    const chartData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const count = allRestaurants.filter(
        r => r.createdAt >= dayStart && r.createdAt <= dayEnd
      ).length;

      return { date: dayStart.toISOString().split("T")[0], count };
    }).reverse();

    res.json({ total, weekly, monthly, chartData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch restaurant stats" });
  }
});



router.delete("/delete-restaurant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting restaurant with ID:", id);

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Delete all related orders
    await Order.deleteMany({ restaurantId: id });

    // Delete restaurant itself
    await Restaurant.findByIdAndDelete(id);

    res.status(200).json({
      message: "Restaurant and related orders deleted successfully",
      deletedRestaurantId: id,
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


//excel export of restaurants

router.get("/download-restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Restaurants");

    // Define columns
    worksheet.columns = [
      { header: "Restaurant ID", key: "_id", width: 25 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Owner Name", key: "ownerName", width: 25 },
      { header: "Contact", key: "contact", width: 20 },
      { header: "Address", key: "address", width: 40 },
      { header: "Description", key: "description", width: 50 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
      { header: "Menu Details", key: "menuDetails", width: 60 },
    ];

    // Add rows
    restaurants.forEach((r) => {
      const menuDetails = r.menu
        .map(
          (cat) =>
            `${cat.category}: ${cat.items
              .map((i) => `${i.name} (${i.price})`)
              .join(", ")}`
        )
        .join(" | ");

      worksheet.addRow({
        _id: r._id,
        name: r.name || "",
        email: r.email || "",
        ownerName: r.ownerName || "",
        contact: r.contact || "",
        address: r.address || "",
        description: r.description || "",
        createdAt: r.createdAt ? r.createdAt.toISOString() : "",
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : "",
        menuDetails,
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=restaurants.xlsx"
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting restaurants:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});





// GET: Download a single restaurant by ID
router.get("/download-restaurant/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Restaurant Details");

    // Define columns
    worksheet.columns = [
      { header: "Restaurant ID", key: "_id", width: 25 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Owner Name", key: "ownerName", width: 25 },
      { header: "Contact", key: "contact", width: 20 },
      { header: "Address", key: "address", width: 40 },
      { header: "Description", key: "description", width: 50 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
      { header: "Menu Details", key: "menuDetails", width: 60 },
    ];

    // Flatten menu items into a readable string
    const menuDetails = restaurant.menu
      .map(
        (cat) =>
          `${cat.category}: ${cat.items
            .map((i) => `${i.name} (${i.price})`)
            .join(", ")}`
      )
      .join(" | ");

    // Add row
    worksheet.addRow({
      _id: restaurant._id,
      name: restaurant.name || "",
      email: restaurant.email || "",
      ownerName: restaurant.ownerName || "",
      contact: restaurant.contact || "",
      address: restaurant.address || "",
      description: restaurant.description || "",
      createdAt: restaurant.createdAt ? restaurant.createdAt.toISOString() : "",
      updatedAt: restaurant.updatedAt ? restaurant.updatedAt.toISOString() : "",
      menuDetails,
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${restaurant.name}_details.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting restaurant:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});




router.get("/download-orders/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Fetch restaurant info
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Fetch orders for this restaurant
    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // Define columns
    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 25 },
      { header: "Customer Name", key: "customerName", width: 25 },
      { header: "Customer Mobile", key: "customerMobile", width: 20 },
      { header: "Table", key: "table", width: 10 },
      { header: "Order Items", key: "items", width: 50 },
      { header: "Total Price", key: "totalPrice", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Order Time", key: "orderTime", width: 25 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
    ];

    // Add rows
    orders.forEach((order) => {
      const itemsStr = order.items
        .map((i) => `${i.name} (${i.quantity} x ${i.price})`)
        .join(", ");

      worksheet.addRow({
        orderId: order.orderId,
        customerName: order.customer?.name || "",
        customerMobile: order.customer?.mobile || "",
        table: order.customer?.table || "",
        items: itemsStr,
        totalPrice: order.totalPrice,
        status: order.status,
        orderTime: order.orderTime ? order.orderTime.toISOString() : "",
        createdAt: order.createdAt ? order.createdAt.toISOString() : "",
        updatedAt: order.updatedAt ? order.updatedAt.toISOString() : "",
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${restaurant.name}_orders.xlsx`
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Admin Logout
router.post("/logout", (req, res) => {
  // Just a response, actual logout should happen on the client by deleting the token
  res.json({ message: "Admin logged out successfully" });
});


export default router;
