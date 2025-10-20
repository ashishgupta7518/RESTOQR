import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const categorySchema = new mongoose.Schema({
  category: String,
  items: [itemSchema],
});

const restaurantSchema = new mongoose.Schema(
  {
    // ✅ Login info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ Profile info (moved here from RestaurantProfile)
    ownerName: { type: String },
    contact: { type: String },
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    description: { type: String },

    // ✅ Menu info
    menu: [categorySchema],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
