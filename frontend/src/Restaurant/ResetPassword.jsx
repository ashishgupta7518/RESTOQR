import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE_URL from "../config";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(true);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setShowOldPassword(!showOldPassword);
    setFormData({ email: "", oldPassword: "", newPassword: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = showOldPassword
        ? formData
        : { email: formData.email, newPassword: formData.newPassword };

      const res = await axios.post(`${API_BASE_URL}/auth/change-password`, payload);
      toast.success(res.data.message || "Password updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {showOldPassword ? "Change Password" : "Forgot Password"}
          </h2>
          <button
            onClick={toggleMode}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            {showOldPassword
              ? "Forgot password?"
              : "Remembered your password? Change normally"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter your registered email"
            />
          </div>

          {/* Old Password (if in normal mode) */}
          {showOldPassword && (
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">
                Old Password
              </label>
              <input
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Enter your current password"
              />
              <span
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, old: !prev.old }))
                }
                className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              >
                {showPassword.old ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          {/* New Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter a new secure password"
            />
            <span
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
