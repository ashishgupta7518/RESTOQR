import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import API_BASE_URL from "../config";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, MapPin, Save } from "lucide-react";

const RestaurantProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    ownerName: "",
    contact: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const restaurantId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!restaurantId || !token) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/auth/restaurant/profile/${restaurantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormData({
          email: res.data.email || "",
          ownerName: res.data.ownerName || "",
          contact: res.data.contact || "",
          address: res.data.address || "",
          latitude: res.data.latitude || "",
          longitude: res.data.longitude || "",
          description: res.data.description || "",
        });

        toast.success("Profile loaded successfully!");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.loading("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=7e87fb2d52b04d2eae5ea890f18664c8`
          );
          const data = await res.json();

          if (data?.results?.length > 0) {
            const address = data.results[0].formatted;
            setFormData((prev) => ({ ...prev, address, latitude, longitude }));
            toast.dismiss();
            toast.success("Location fetched successfully!");
          } else {
            toast.dismiss();
            toast.error("Address not found. Try again.");
          }
        } catch (err) {
          toast.dismiss();
          console.error(err);
          toast.error("Failed to fetch address. Check internet or API key.");
        }
      },
      (err) => {
        toast.dismiss();
        if (err.code === 1) toast.error("Permission denied. Please allow location access.");
        else toast.error("Unable to get location.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in!");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/auth/restaurant/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 p-8">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-3xl bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-200"
      >
        {/* Decorative Logo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-lg border border-gray-100">
          <img
            src="https://cdn-icons-png.flaticon.com/512/857/857681.png"
            alt="Restaurant Logo"
            className="w-14 h-14"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mt-8 mb-6">
          🍽 Restaurant Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-4 focus:ring-red-200 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-4 focus:ring-red-200 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-4 focus:ring-red-200 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Address</label>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleGetLocation}
                className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-md hover:opacity-90"
              >
                <MapPin className="w-4 h-4" /> Get Location
              </motion.button>
            </div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 h-24 text-lg focus:ring-4 focus:ring-red-200 focus:outline-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 h-24 text-lg focus:ring-4 focus:ring-red-200 focus:outline-none"
            ></textarea>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-all text-lg cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="w-5 h-5" />}
            {loading ? "Saving..." : "Save Profile"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RestaurantProfile;
