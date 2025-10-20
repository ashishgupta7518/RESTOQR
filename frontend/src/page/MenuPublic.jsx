import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Search,
  User,
  Filter,
  Star,
  Flame,
} from "lucide-react";

import API_BASE_URL from "./../config";

const MenuPublic = () => {
  const { id } = useParams();
  const [restname, setRestname] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState({});
  const [page, setPage] = useState(1);
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

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Loading menu...
      </div>
    );
  }

  const categories = restaurant.menu.map((cat) => cat.category);
  const allItems =
    restaurant.menu.find((cat) => cat.category === selectedCategory)?.items ||
    [];
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
    const item = allItems.find((i) => i._id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between bg-white shadow-sm p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">🍽️ {restname}</h1>
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-600 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer" />
          <User className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6">
        {/* Sidebar */}
        <aside className="md:w-64 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-3">Menu Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-md cursor-pointer ${selectedCategory === cat
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                {cat}
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 mt-6 pt-4">
            <p className="text-sm text-gray-500">Current Order</p>
            <p className="text-xl font-bold">${total.toFixed(2)}</p>
            <button className="w-full mt-3 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
              View Cart
            </button>
          </div>
        </aside>

        {/* Menu Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold capitalize">
              {selectedCategory}
            </h2>
            <button className="flex items-center gap-2 text-sm border px-3 py-1 rounded-md hover:bg-gray-100">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item._id}
                className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Badge */}
                {item.isNew && (
                  <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                {item.isPopular && (
                  <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Popular
                  </span>
                )}

                {/* Image */}
                <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-40 w-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-sm">Image</span>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
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
                    ({item.reviews || 0} reviews)
                  </span>
                </div>

                {/* Price & Cart */}
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-gray-800">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    {cart[item._id] ? (
                      <>
                        <button
                          onClick={() => handleRemove(item)}
                          className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span>{cart[item._id]}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
                      >
                        Add to Cart
                      </button>
                    )}
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
                  className={`px-3 py-1 border rounded-md ${page === i + 1
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
      </div>
    </div>
  );
};

export default MenuPublic;
