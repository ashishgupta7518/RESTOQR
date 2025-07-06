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

const restaurantSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  menu: [categorySchema],
}, { timestamps: true });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
