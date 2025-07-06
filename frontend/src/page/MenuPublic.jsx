import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MenuPublic = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/public/menu/${id}`)
      .then(res => setRestaurant(res.data))
      .catch(() => setRestaurant(null));
  }, [id]);

  if (!restaurant) return <div className="p-4 text-red-600">Menu not found or loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Menu: {restaurant.name}</h1>
      {restaurant.menu.map((cat, i) => (
        <div key={i} className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">{cat.category}</h2>
          <ul className="list-disc list-inside pl-4">
            {cat.items.map((item, j) => (
              <li key={j} className="text-gray-600">
                <span className="font-medium">{item.name}</span> - ₹{item.price}  
                <span className="text-sm text-gray-500 ml-2">{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MenuPublic;
