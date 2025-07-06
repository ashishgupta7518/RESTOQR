import express from "express";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";

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

// Admin Logout
router.post("/logout", (req, res) => {
  // Just a response, actual logout should happen on the client by deleting the token
  res.json({ message: "Admin logged out successfully" });
});


export default router;
