import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// Admin or Restaurant Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Admin login
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
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
    res.status(500).json({ error: "Login error" });
  }
});

// Restaurant Register
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

    await newRest.save();
    res.status(201).json({ message: "Restaurant registered" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});



export default router;
