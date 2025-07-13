import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./../config";

const MenuPublic = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/public/menu/${id}`)
      .then((res) => setRestaurant(res.data))
      .catch(() => setRestaurant(null));
  }, [id]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-500">
        Menu not found or loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          {restaurant.name}'s Menu
        </h1>

        {restaurant.menu.length === 0 && (
          <p className="text-center text-gray-500">No menu items found.</p>
        )}

        {restaurant.menu.map((cat, i) => (
          <div key={i} className="mb-8 bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-600 border-b pb-2 mb-4">
              {cat.category}
            </h2>
            <div className="space-y-4">
              {cat.items.map((item, j) => (
                <div
                  key={j}
                  className="flex justify-between items-start p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ₹{item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPublic;
