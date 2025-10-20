import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";


const router = express.Router();

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Admin login
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // For admin, there’s no _id in DB, so we can just send a placeholder id
    return res.json({ token, role: "admin", id: "admin" });
  }

  // Restaurant login
  try {
    const user = await Restaurant.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "restaurant" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: "restaurant", id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
});


// ======================= REGISTER =======================
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
    res.status(201).json({ message: "Restaurant registered", restaurant: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ======================= CREATE / UPDATE PROFILE =======================
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

// ======================= GET PROFILE =======================
router.get("/restaurant/profile/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    console.log("Fetching profile for Restaurant ID:", restaurantId);

    // Fetch restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Prepare the response
    const response = {
      email: restaurant.email || "",
      ownerName: restaurant.ownerName || "",
      contact: restaurant.contact || "",
      address: restaurant.address || "",
      latitude: restaurant.latitude || null,
      longitude: restaurant.longitude || null,
      description: restaurant.description || "",
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
