import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setShowOldPassword(!showOldPassword);
    setFormData({ email: "", oldPassword: "", newPassword: "" });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = showOldPassword
        ? formData
        : { email: formData.email, newPassword: formData.newPassword };

      const res = await axios.post(`${API_BASE_URL}/auth/change-password`, payload);
      setMessage({ type: "success", text: res.data.message || "Password updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
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

        {message && (
          <div
            className={`p-3 mb-4 text-sm rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
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

          {/* Old password (only in normal mode) */}
          {showOldPassword && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Enter your current password"
              />
            </div>
          )}

          {/* New password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Enter a new secure password"
            />
          </div>

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
