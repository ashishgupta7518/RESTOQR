import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

/* ===============================
   🟢 Admin or Restaurant Login
================================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Admin login
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token, role: "admin" });
  }

  // Restaurant login
  try {
    const user = await Restaurant.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "restaurant" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, role: "restaurant" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
});

/* ===============================
   🟢 Restaurant Register
================================= */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await Restaurant.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newRest = new Restaurant({
      name,
      email,
      password: hashed,
      menu: [],
    });

    const saved = await newRest.save();
    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: saved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ===============================
   🟢 Create or Update Restaurant Profile
================================= */
router.post("/restaurant/profile", async (req, res) => {
  try {
    const { email, ownerName, contact, address, latitude, longitude, description } = req.body;

    // Find restaurant using email
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Update profile info in the same document
    restaurant.ownerName = ownerName || restaurant.ownerName;
    restaurant.contact = contact || restaurant.contact;
    restaurant.address = address || restaurant.address;
    restaurant.latitude = latitude ? Number(latitude) : restaurant.latitude;
    restaurant.longitude = longitude ? Number(longitude) : restaurant.longitude;
    restaurant.description = description || restaurant.description;

    const updated = await restaurant.save();

    res.status(200).json({
      message: "Profile saved successfully",
      restaurant: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving restaurant profile" });
  }
});

/* ===============================
   🟢 Get Restaurant Profile by ID
================================= */
router.get("/restaurant/profile/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select(
      "-password -menu"
    ); // exclude password & menu

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json(restaurant);
  } catch (err) {
    console.error("Error fetching restaurant:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
