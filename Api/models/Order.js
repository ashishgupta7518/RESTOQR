import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const itemSchema = new mongoose.Schema({
    itemId: String,
    name: String,
    price: Number,
    quantity: Number,
    total: Number,
});

const customerSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    table: String,
    customerId: { type: String, default: () => uuidv4() }, // auto-generate customerId
});

const orderSchema = new mongoose.Schema(
    {
        orderId: { type: String, unique: true, default: () => uuidv4() }, // ✅ auto-generate
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        restaurantName: String,
        customer: customerSchema,
        items: [itemSchema],
        totalPrice: Number,
        status: { type: String, enum: ["pending", "served"], default: "pending" },
        orderTime: { type: Date, default: Date.now }, // auto timestamp
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
