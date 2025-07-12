import express from "express";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// Middleware to check JWT and get restaurant ID
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.restaurantId = decoded.id;
    next();
  });
};

// Add or update menu
router.post("/menu", verifyToken, async (req, res) => {
  const { menu } = req.body;
  try {
    const restaurant = await Restaurant.findById(req.restaurantId);
    restaurant.menu = menu;
    await restaurant.save();
    res.json({ message: "Menu updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update menu" });
  }
});

// Get own menu
router.get("/menu", verifyToken, async (req, res) => {
  const restaurant = await Restaurant.findById(req.restaurantId);
  res.json({ menu: restaurant.menu, restaurantId: restaurant._id });
});

export default router;
