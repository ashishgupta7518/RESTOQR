import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { PlusCircle, Trash2, Edit2, Image, Check, X } from "lucide-react";
import API_BASE_URL from "./../config";
import toast, { Toaster } from "react-hot-toast";

const RestaurantMenu = () => {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("");
  const [item, setItem] = useState({ name: "", price: "", description: "" });
  const [search, setSearch] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [editing, setEditing] = useState({ catIndex: null, itemIndex: null }); 

  const token = localStorage.getItem("token");

  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);


  const addItem = (e) => {
    e.preventDefault();

    if (!item.name || !category || !item.price) {
      toast.error("Please fill all fields!");
      return;
    }

    const updated = [...menu];
    const catIndex = updated.findIndex((c) => c.category === category);

    if (editing.catIndex !== null && editing.itemIndex !== null) {
      // Update existing item
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
      updated.splice(catIndex, 1); // remove category if empty
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
    <div className="min-h-screen bg-gray-50 p-6 text-sm">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
      <p className="text-gray-600 mb-6">
        Add, edit and manage your restaurant menu items
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add/Edit Menu Item */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            {editing.catIndex !== null ? "Edit Menu Item" : "Add New Menu Item"}
          </h3>
          <form onSubmit={addItem} className="space-y-4">
            <input
              type="text"
              placeholder="e.g. Margherita Pizza"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="e.g. 12.99"
              value={item.price}
              onChange={(e) => setItem({ ...item, price: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Describe your menu item..."
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              rows={3}
            ></textarea>

            <div className="border rounded p-4 text-center text-gray-400">
              <Image className="mx-auto mb-2" />
              Upload a file or drag and drop (PNG, JPG, GIF up to 10MB)
            </div>

            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded w-full hover:bg-gray-800"
            >
              {editing.catIndex !== null ? "Update Item" : "Add Menu Item"}
            </button>
          </form>
        </div>

        {/* Menu List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Your Menu Items</h3>
          <div className="mb-4 flex items-center justify-between">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          </div>

          <ul className="space-y-4 max-h-[400px] overflow-y-auto">
            {menu.length === 0 ? (
              <li className="text-gray-500 text-sm">No items added yet.</li>
            ) : (
              menu.map((cat, i) => (
                <li key={i}>
                  <h4 className="font-bold mb-2">{cat.category}</h4>
                  <ul className="space-y-2">
                    {cat.items
                      .filter((itm) =>
                        itm.name.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((item, j) => (
                        <li
                          key={j}
                          className="flex justify-between items-start border p-3 rounded"
                        >
                          <div className="flex flex-col">
                            <strong>{item.name}</strong>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                            <span className="text-sm font-medium">
                              ₹{item.price}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => editItem(i, j)}>
                              <Edit2 className="w-4 h-4 text-gray-500 hover:text-yellow-500" />
                            </button>
                            <button onClick={() => deleteItem(i, j)}>
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* QR Code Generator */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          Generate QR Code for Your Menu
        </h3>
        <div className="flex items-center justify-center border h-32 mb-4">
          <QRCodeCanvas
            value={`https://restoqr-98na.onrender.com/menu/${restaurantId}`}
            size={100}
          />
        </div>
        <div className="text-center">
          <button
            onClick={saveMenu}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Save Menu to Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
