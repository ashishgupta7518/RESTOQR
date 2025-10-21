import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Filter, Star, Flame, X } from "lucide-react";
import API_BASE_URL from "./../config";

const MenuPublic = () => {
  const { id } = useParams();
  const [restname, setRestname] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState({});
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    table: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/public/menu/${id}`)
      .then((res) => {
        setRestaurant(res.data);
        setRestname(res.data.name);
        if (res.data.menu.length > 0)
          setSelectedCategory(res.data.menu[0].category);
      })
      .catch(() => setRestaurant(null));
  }, [id]);

  useEffect(() => {
    const savedInfo = localStorage.getItem("customerInfo");
    if (!savedInfo) setShowForm(true);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, mobile, table } = formData;
    if (!name || !mobile || !table) {
      alert("Please fill all fields.");
      return;
    }
    localStorage.setItem("customerInfo", JSON.stringify(formData));
    setShowForm(false);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Loading menu...
      </div>
    );
  }

  // ----- Customer Form Landing Page -----
  if (showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80"
            alt="restaurant background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="relative z-10 bg-white text-black p-10 rounded-3xl w-96 shadow-2xl flex flex-col items-center gap-6"
        >
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <h1 className="text-3xl font-bold text-center">🍴 Welcome to {restname}!</h1>
          <p className="text-center text-gray-600 mb-4">
            Enter your details to start your delicious journey.
          </p>

          <div className="w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none placeholder-gray-400 transition"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none placeholder-gray-400 transition"
            />

            <input
              type="text"
              placeholder="Table Number"
              value={formData.table}
              onChange={(e) =>
                setFormData({ ...formData, table: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none placeholder-gray-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow-md"
          >
            Start Ordering
          </button>

          <p className="text-sm text-gray-500 mt-2 text-center">
            By continuing, you agree to enjoy a delightful experience!
          </p>
        </form>
      </div>
    );
  }

  // ----- Menu Page -----
  const categories = restaurant.menu.map((cat) => cat.category);
  const allItems =
    restaurant.menu.find((cat) => cat.category === selectedCategory)?.items ||
    [];
  const allRestaurantItems = restaurant.menu.flatMap((cat) => cat.items);
  const paginatedItems = allItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleAddToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item._id]: (prev[item._id] || 0) + 1,
    }));
  };

  const handleRemove = (item) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[item._id] > 1) newCart[item._id] -= 1;
      else delete newCart[item._id];
      return newCart;
    });
  };

  const total = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = allRestaurantItems.find((i) => i._id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Hero Header */}
      <header className="relative h-60 md:h-72 bg-cover bg-center flex items-center justify-center text-white">
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80"
          alt="restaurant hero"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{restname}</h1>
          <p className="text-gray-200 text-lg md:text-xl">
            Welcome! Explore our menu and place your order.
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6 mt-6">
        {/* Sidebar */}
        <aside className="md:w-64 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-3">Menu Categories</h2>
          <ul className="space-y-2 flex-1">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg cursor-pointer transition ${selectedCategory === cat
                  ? "bg-black text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                {cat}
              </li>
            ))}
          </ul>

          {/* Cart Summary */}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-sm text-gray-500">Current Order</p>
            <p className="text-2xl font-bold">₹{total.toFixed(2)}</p>

            {Object.keys(cart).length > 0 && (
              <button
                onClick={async () => {
                  const customerInfo = JSON.parse(
                    localStorage.getItem("customerInfo")
                  );
                  if (!customerInfo) {
                    alert("Please enter your details first!");
                    return;
                  }

                  const orderItems = Object.entries(cart).map(([id, qty]) => {
                    let itemFound;
                    restaurant.menu.forEach((cat) => {
                      const i = cat.items.find((item) => item._id === id);
                      if (i) itemFound = i;
                    });
                    return {
                      itemId: itemFound._id,
                      name: itemFound.name,
                      price: itemFound.price,
                      quantity: qty,
                      total: itemFound.price * qty,
                    };
                  });

                  const totalPrice = orderItems.reduce(
                    (acc, i) => acc + i.total,
                    0
                  );

                  const orderPayload = {
                    restaurantId: restaurant._id,
                    customer: {
                      ...customerInfo,
                      customerId: crypto.randomUUID(),
                    },
                    items: orderItems,
                    totalPrice,
                    status: "pending",
                  };

                  try {
                    await axios.post(`${API_BASE_URL}/order/restaurant`, orderPayload);
                    alert("Order placed successfully!");
                    setCart({});
                  } catch (err) {
                    console.error(err);
                    alert("Failed to place order.");
                  }
                }}
                className="w-full mt-3 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" /> Place Order
              </button>
            )}
          </div>
        </aside>

        {/* Menu Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold capitalize">{selectedCategory}</h2>
            <button className="flex items-center gap-2 text-sm border px-3 py-2 rounded-xl hover:bg-gray-100 transition">
              <Filter className="w-5 h-5" /> Filter
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item._id}
                className="relative bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col"
              >
                {item.isPopular && (
                  <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 z-10">
                    <Flame className="w-3 h-3" /> Popular
                  </span>
                )}

                <div className="h-48 md:h-56 w-full relative overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                      Image
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (item.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({item.reviews || 0})
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-gray-800">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      {cart[item._id] ? (
                        <>
                          <button
                            onClick={() => handleRemove(item)}
                            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span>{cart[item._id]}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-black text-white text-sm px-5 py-2 rounded-xl hover:bg-gray-800 transition"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from(
              { length: Math.ceil(allItems.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded-xl transition ${page === i + 1
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </main>
      </main>
    </div>
  );
};

export default MenuPublic;
