import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";
import Admin from "../models/Admin.js";


const router = express.Router();

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    // Admin/Superadmin login
    const adminUser = await Admin.findOne({ email: email.toLowerCase().trim() });
    console.log("Admin user found:", adminUser);
    if (adminUser) {
      const isMatch = await bcrypt.compare(password.trim(), adminUser.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: adminUser._id, role: adminUser.role, email: adminUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ token, role: adminUser.role, id: adminUser._id });
    }

    // Restaurant login
    const restaurant = await Restaurant.findOne({ email: email.toLowerCase().trim() });
    console.log("Restaurant found:", restaurant);
    if (!restaurant) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password.trim(), restaurant.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: restaurant._id, role: "restaurant" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token, role: "restaurant", id: restaurant._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
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




// ======================= CHANGE / RESET PASSWORD =======================
router.post("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    // Find the restaurant
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // If old password provided, verify it
    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, restaurant.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }
    } else {
      // If no old password, this is a reset — in real apps, this should only be done after email verification
      console.warn(`Password reset without old password for email: ${email}`);
    }

    // Hash and save new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    restaurant.password = hashedNewPassword;
    await restaurant.save();

    res.status(200).json({
      message: oldPassword
        ? "Password changed successfully"
        : "Password reset successfully",
    });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Error changing password" });
  }
});


export default router;
