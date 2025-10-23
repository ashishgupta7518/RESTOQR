import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { PlusCircle, Trash2, Edit2, Image, Save } from "lucide-react";
import API_BASE_URL from "./../config";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const RestaurantMenu = () => {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("");
  const [item, setItem] = useState({ name: "", price: "", description: "" });
  const [search, setSearch] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [editing, setEditing] = useState({ catIndex: null, itemIndex: null });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const categories = [
    "Starters",
    "Main Course",
    "Biryani",
    "Chinese",
    "Pasta",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "Snacks",
    "Desserts",
    "Beverages",
    "Soups",
    "Salads",
    "Breakfast",
    "Tandoor",
    "Seafood",
  ];

  const addItem = (e) => {
    e.preventDefault();

    if (!item.name || !category || !item.price) {
      toast.error("Please fill all fields!");
      return;
    }

    const updated = [...menu];
    const catIndex = updated.findIndex((c) => c.category === category);

    if (editing.catIndex !== null && editing.itemIndex !== null) {
      updated[editing.catIndex].items[editing.itemIndex] = item;
      toast.success("Item updated!");
      setEditing({ catIndex: null, itemIndex: null });
    } else if (catIndex >= 0) {
      updated[catIndex].items.push(item);
      toast.success("Item added!");
    } else {
      updated.push({ category, items: [item] });
      toast.success("New category and item added!");
    }

    setMenu(updated);
    setItem({ name: "", price: "", description: "" });
    setCategory("");
  };

  const editItem = (catIndex, itemIndex) => {
    const selected = menu[catIndex].items[itemIndex];
    setCategory(menu[catIndex].category);
    setItem(selected);
    setEditing({ catIndex, itemIndex });
  };

  const deleteItem = (catIndex, itemIndex) => {
    const updated = [...menu];
    updated[catIndex].items.splice(itemIndex, 1);

    if (updated[catIndex].items.length === 0) {
      updated.splice(catIndex, 1);
    }

    setMenu(updated);
    toast.success("Item deleted!");
  };

  const saveMenu = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/restaurant/menu`,
        { menu },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Menu saved to database!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save menu!");
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/restaurant/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu(res.data.menu || []);
      setRestaurantId(res.data.restaurantId || "");
    } catch (err) {
      console.error("Error fetching menu:", err);
      toast.error("Failed to fetch menu!");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-red-50 py-10 px-6 md:px-16">
      <Toaster />
      <motion.h2
        className="text-4xl font-bold text-center mb-2 text-gray-900"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🍽️ Restaurant Menu Manager
      </motion.h2>
      <p className="text-center text-gray-600 mb-10">
        Craft your restaurant’s delicious menu — add, edit, and manage dishes easily!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add / Edit Form */}
        <motion.div
          className="col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-green-600" />
            {editing.catIndex !== null ? "Edit Menu Item" : "Add New Dish"}
          </h3>
          <form onSubmit={addItem} className="space-y-4">
            <input
              type="text"
              placeholder="Dish Name (e.g., Butter Chicken)"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-red-400 outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md bg-white focus:ring-2 focus:ring-red-400 outline-none"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Price (₹)"
              value={item.price}
              onChange={(e) => setItem({ ...item, price: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-red-400 outline-none"
            />

            <textarea
              placeholder="Short description of the dish..."
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-red-400 outline-none"
              rows={3}
            ></textarea>

            <div className="border border-dashed rounded-md p-4 text-center text-gray-400 hover:bg-gray-50 transition">
              <Image className="mx-auto mb-2 w-6 h-6" />
              Upload image (optional)
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition-all"
            >
              {editing.catIndex !== null ? "Update Dish" : "Add Dish"}
            </button>
          </form>
        </motion.div>

        {/* Menu Display */}
        <div className="col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🍴 Menu Items</h3>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-red-400 outline-none"
              />
            </div>

            {menu.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No dishes added yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.map((cat, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl bg-gradient-to-br from-white to-red-50 shadow-sm p-4"
                  >
                    <h4 className="font-bold text-gray-800 mb-3 text-lg border-b pb-1 border-gray-200">
                      {cat.category}
                    </h4>
                    <ul className="space-y-3">
                      {cat.items
                        .filter((itm) =>
                          itm.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((itm, j) => (
                          <motion.li
                            key={j}
                            className="bg-white rounded-md p-3 flex justify-between shadow-sm hover:shadow-md transition"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div>
                              <p className="font-semibold text-gray-800">{itm.name}</p>
                              <p className="text-xs text-gray-500">
                                {itm.description}
                              </p>
                              <p className="text-sm font-medium text-red-600">
                                ₹{itm.price}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button onClick={() => editItem(i, j)}>
                                <Edit2 className="w-4 h-4 text-yellow-500 hover:text-yellow-600" />
                              </button>
                              <button onClick={() => deleteItem(i, j)}>
                                <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                              </button>
                            </div>
                          </motion.li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <motion.div
        className="mt-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📱 Generate Menu QR Code
        </h3>
        <div className="flex justify-center mb-4">
          <QRCodeCanvas
            value={`https://restoqr-98na.onrender.com/menu/${restaurantId}`}
            size={120}
          />
        </div>
        <button
          onClick={saveMenu}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-all"
        >
          <Save className="w-4 h-4" /> Save Menu to Database
        </button>
      </motion.div>
    </div>
  );
};

export default RestaurantMenu;
