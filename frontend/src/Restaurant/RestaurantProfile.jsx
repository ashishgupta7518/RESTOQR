import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import toast, { Toaster } from "react-hot-toast";

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
    console.log("Restaurant ID:", restaurantId);

    // Fetch profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!restaurantId || !token) return;

            try {
                setLoading(true);
                const res = await axios.get(
                    `${API_BASE_URL}/auth/restaurant/profile/${restaurantId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
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
            console.log("Profile Response:", res.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen px-6 py-8 flex justify-center">
            <Toaster position="top-center" autoClose={2500} />
            <div className="w-full bg-white shadow-md rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 flex items-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/857/857681.png"
                        alt="Restaurant"
                        className="w-7 h-7 mr-2"
                    />
                    Restaurant Profile
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* Owner Name */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Owner Name</label>
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Contact & Email */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">Contact Number</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-700 font-medium">Address</label>
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                className="bg-gray-900 text-white px-3 py-1.5 text-sm rounded-md hover:bg-gray-800"
                            >
                                📍 Get Location
                            </button>
                        </div>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-20 focus:ring-2 focus:ring-gray-800 focus:outline-none"
                            required
                        ></textarea>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-gray-800 focus:outline-none"
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200 cursor-pointer"
                    >
                        {loading ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestaurantProfile;
