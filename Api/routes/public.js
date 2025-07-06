import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// Get public menu by restaurant ID
router.get("/menu/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id, "name menu");
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

export default router;
