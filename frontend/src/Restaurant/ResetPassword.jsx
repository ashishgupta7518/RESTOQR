import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Lock, KeyRound } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 p-8">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-200"
      >
        {/* Floating Logo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-md border border-gray-100">
          <Lock className="w-10 h-10 text-rose-500" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mt-8 mb-6">
          {showOldPassword ? "🔐 Change Password" : "🔑 Forgot Password"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your registered email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-4 focus:ring-rose-200 focus:outline-none"
            />
          </div>

          {/* Old Password */}
          {showOldPassword && (
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">Old Password</label>
              <input
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                placeholder="Enter your current password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 text-lg focus:ring-4 focus:ring-rose-200 focus:outline-none"
              />
              <span
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, old: !prev.old }))
                }
                className="absolute right-4 top-10 text-gray-500 cursor-pointer"
              >
                {showPassword.old ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          {/* New Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">New Password</label>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter a new secure password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 text-lg focus:ring-4 focus:ring-rose-200 focus:outline-none"
            />
            <span
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute right-4 top-10 text-gray-500 cursor-pointer"
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Toggle Mode */}
          <div className="text-right">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-rose-600 hover:text-rose-800 font-medium transition cursor-pointer"
            >
              {showOldPassword
                ? "Forgot password?"
                : "Remembered your password? Change normally"}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-all text-lg cursor-pointer"
          >
            {loading ? (
              <>
                <KeyRound className="animate-spin w-5 h-5" /> Updating...
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5" /> Update Password
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
