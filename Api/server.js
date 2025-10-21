import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import restaurantRoutes from "./routes/restaurant.js";
import adminRoutes from "./routes/admin.js";
import publicRoutes from "./routes/public.js";
import Orders from "./routes/Ordersroute.js";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/order", Orders);

// Connect DB and Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running  on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
