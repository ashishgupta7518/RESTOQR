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
    return res.json({ _id, token, role: "admin" });
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
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "restaurant") return res.status(403).json({ message: "Forbidden" });

    const { ownerName, contact, address, latitude, longitude, description } = req.body;

    const restaurant = await Restaurant.findById(decoded.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // Check if profile exists
    let profile = await Restaurant.findOne({ restaurantId: restaurant._id });

    if (profile) {
      profile.ownerName = ownerName || profile.ownerName;
      profile.contact = contact || profile.contact;
      profile.address = address || profile.address;
      profile.latitude = latitude ? Number(latitude) : profile.latitude;
      profile.longitude = longitude ? Number(longitude) : profile.longitude;
      profile.description = description || profile.description;
      await profile.save();
      res.status(200).json({ message: "Profile updated successfully", profile });
    } else {
      const newProfile = new Restaurant({
        restaurantId: restaurant._id,
        ownerName,
        contact,
        address,
        latitude,
        longitude,
        description,
      });
      await newProfile.save();
      res.status(201).json({ message: "Profile created successfully", newProfile });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating restaurant profile" });
  }
});

// ======================= GET PROFILE =======================
router.get("/restaurant/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "restaurant") return res.status(403).json({ message: "Forbidden" });

    const profile = await Restaurant.findOne({ restaurantId: decoded.id });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
